import { realtimeDbInstance } from "@/app/utils/firebase-admin-control/firebaseAdmin";

export async function GET(req: Request) {
    const stream = new ReadableStream({
        async start(controller) {
            const usersRef = realtimeDbInstance.ref("users");

            usersRef.on("value", (snapshot) => {
                const data = snapshot.val();
                const message = `data: ${JSON.stringify(data)}\n\n`;

                if (controller && controller.desiredSize && controller.desiredSize > 0) {
                    controller.enqueue(new TextEncoder().encode(message));
                }
            });

            controller.close = () => {
                usersRef.off('value',);
            };
        },
        cancel() {
            console.log('Stream canceled');
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
