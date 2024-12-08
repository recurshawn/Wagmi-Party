import { AccessToken, Role } from "@huddle01/server-sdk/auth";

// export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  console.log("key", process.env.HUDDLE_API_KEY);
  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY as string,
    roomId: roomId as string,
    role: Role.SPEAKER,
    permissions: {
      admin: false,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: false,
        mic: true,
        screen: false,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  console.log(accessToken);
  const token = await accessToken.toJwt();
  console.log(token);
  return new Response(token, { status: 200 });
}
