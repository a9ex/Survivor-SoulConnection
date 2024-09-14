import 'dotenv/config';
import { z } from 'zod';

const LoginResponse = z.object({
  access_token: z.string(),
});

export type FetcherResult<T> = { success: true; data: T } | { success: false };

class Fetcher {
  private static _TIME_TO_RESET = 1 * 60 * 1000;
  private static _MAX_REQUESTS = 180;
  private static _MAX_RETRY = 5;

  private _start: Date = new Date();
  private _requests: number = 0;
  private _token: Promise<FetcherResult<string>>;

  constructor() {
    this._token = this.fetch('/employees/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Group-Authorization': process.env.MIGRATION_GROUP_AUTHORIZATION,
      },
      body: JSON.stringify({
        email: process.env.MIGRATION_USER_EMAIL,
        password: process.env.MIGRATION_USER_PASSWORD,
      }),
    }).then((res) => {
      if (!res.success) return { success: false };
      return res.data
        .json()
        .then((data) => {
          const result = LoginResponse.parse(data);
          return { success: true, data: result.access_token };
        })
        .catch((err) => {
          console.error('Failed to parse the login response:', err);
          return { success: false };
        });
    });
  }

  private static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async fetch(path: string, options?: RequestInit): Promise<FetcherResult<Response>> {
    let response: Response;

    for (let i = 0; i < Fetcher._MAX_RETRY; i++) {
      // Reset the start time and count of requests if the time to reset has passed
      if (new Date().getTime() + Fetcher._TIME_TO_RESET >= this._start.getTime()) {
        this._start = new Date();
        this._requests = 0;
      }

      // Wait if the number of requests is greater than the max
      if (this._requests >= Fetcher._MAX_REQUESTS) {
        console.log(`Reached the maximum number of requests. Waiting for ${Fetcher._TIME_TO_RESET / 1000} seconds...`);
        await Fetcher.sleep(this._start.getTime() + Fetcher._TIME_TO_RESET - new Date().getTime());
        this._start = new Date();
        this._requests = 0;
      }

      this._requests++;

      // Issue the request
      response = await fetch(`${process.env.MIGRATION_API_URL}${path}`, options);

      if (response.ok || response.status === 404) break;

      console.error(`[${i + 1}/${Fetcher._MAX_RETRY}] Failed to fetch ${path}: ${response.statusText}`);

      if (i + 1 !== Fetcher._MAX_RETRY) {
        const delay = Math.pow(2, i);
        console.error(`[${i + 1}/${Fetcher._MAX_RETRY}] Retrying in ${delay} seconds...`);
        await Fetcher.sleep(delay * 1000);
      } else {
        console.error(`[${i + 1}/${Fetcher._MAX_RETRY}] Giving up...`);
      }
    }

    if (!response.ok) return { success: false };
    return { success: true, data: response };
  }

  public async get<T extends z.ZodSchema>(path: string, schema: T): Promise<FetcherResult<z.infer<T>>> {
    const token = await this._token;
    if (!token.success) return { success: false };

    const result = await this.fetch(path, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Group-Authorization': process.env.MIGRATION_GROUP_AUTHORIZATION,
        Authorization: `Bearer ${token.data}`,
      },
    });

    if (!result.success) return result;
    return { success: true, data: schema.parse(await result.data.json()) };
  }

  public async image(path: string): Promise<FetcherResult<Buffer>> {
    const token = await this._token;
    if (!token.success) return { success: false };

    const result = await this.fetch(path, {
      method: 'GET',
      headers: {
        Accept: 'image/png',
        'X-Group-Authorization': process.env.MIGRATION_GROUP_AUTHORIZATION,
        Authorization: `Bearer ${token.data}`,
      },
    });

    if (!result.success) return { success: false };
    return { success: true, data: Buffer.from(await result.data.arrayBuffer()) };
  }

  public async ids(path: string): Promise<FetcherResult<number[]>> {
    const response = await this.get(path, z.array(z.object({ id: z.number() })));

    if (!response.success) return { success: false };
    return { success: true, data: response.data.map((obj) => obj.id) };
  }
}

export default new Fetcher();
