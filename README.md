# Survivor - Soul Connection

A fictitious project for a fictitious company.

The company needs to develop a dashboard for their coaches to help them in their daily work.

The specifications and features required were as follows:

- The homepage should be a dashboard that will resume the main statistics of the agency, such
as the number of clients, the number of coaches, the number of meetings, etc.

- Account Management Page:
 - Allows the creation of employee accounts and assignment of clients to them.
 - Each coach can only see the clients assigned to them (GDPR compliance!).
 - Agency managers must be able to see everything.
- Client Profile Page:
 - Includes the following client information: - Name - Photo - Address - Phone number - A short description of what type of person they are looking for - A section where the coach can list the meetings their client has had (Date of the meeting, a success rating out of 5, a comment on what went wrong, the method through which they met the person: mutual acquaintance, dating app, etc.) - Payment history (accessible only by managers)
- Statistics Page:
 - Allows agency managers to see the performance of their coaches based on the number of meetings their clients have. Must display a maximum amount of information with graphs to compare coaches.
- Advice Page:
 - Compiles a set of tips to help coaches manage all types of profiles.
- Events Page:
 - Displays a schedule of events organized by the agency (parties, workshops, speed dating).
 - The page show a map with the location of the event and the number of clients who have registered.
- Astrological Compatibility:
 - In the API, you will find the astrological signs of the clients. We want a page that allows coaches to analyze the astrological compatibility between two clients.
- Clothing:
 - Clients have sent to the agency photos of their clothing (available in the API).
 - We want a page that allows coaches to view them and test clothing combinations to coach them on their style.

An API is available for fetching data from the old project.
Data must be migrated to the new project on a regular basis, as the old API is still in use.

The old API is read-only. All new data must be on the new API.

## Stack Used
### Frontend
- NextJS (App Router)
- NextUI
- shadcn/ui (for charts ready to use)
- TailwindCSS

### Backend
- NestJS
- Prisma
- PostgreSQL
- Zod / Joi

### DevOps / CD
- Docker
- Jenkins
