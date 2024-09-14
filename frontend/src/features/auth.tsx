'use client';

import { useState } from 'react';
import { Tabs, Tab, Input, Link, Button, Card, CardBody } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import { LucideEye, LucideEyeOff } from 'lucide-react';

export function AuthCard() {
  const [selected, setSelected] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Card className="max-w-full w-[340px] px-6 py-8">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as string)}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <Input
                  isRequired
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  label="Password"
                  variant="bordered"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      aria-label="toggle password visibility"
                    >
                      {isPasswordVisible ? (
                        <LucideEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <LucideEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="max-w-xs"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    type="submit"
                    fullWidth
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      signIn('credentials', { email, password, callbackUrl: '/' });
                    }}
                  >
                    Login
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up" isDisabled>
              <form className="flex flex-col gap-4 h-[300px]">
                <Input isRequired label="Name" placeholder="Enter your name" type="password" />
                <Input isRequired label="Email" placeholder="Enter your email" type="email" />
                <Input isRequired label="Password" placeholder="Enter your password" type="password" />
                <p className="text-center text-small">
                  Already have an account?{' '}
                  <Link size="sm" onPress={() => setSelected('login')} className="cursor-pointer">
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary">
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
