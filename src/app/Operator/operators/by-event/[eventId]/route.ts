import { GET as baseGET } from "@/app/api/organizers/events/[id]/operators/route";
export async function GET(req: Request, ctx: { params: { eventId: string } }) {
  // @ts-ignore
  return baseGET(req, { params: { id: ctx.params.eventId } });
}
