import { DELETE as baseDEL } from "@/app/api/organizers/events/[id]/operators/[opId]/route";
export async function DELETE(req: Request, ctx: { params: { opId: string } }) {
  // @ts-ignore
  return baseDEL(req, { params: { id: "_", opId: ctx.params.opId } });
}
