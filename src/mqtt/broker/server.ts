import { createServer } from "net";

export async function createMqttBroker(port = 1883) {
    const { Aedes } = await import("aedes");
    const broker = await Aedes.createBroker();
    const server = createServer(broker.handle);

    return new Promise<void>((resolve) => {
        server.on("error", (err: any) => {
            if (err.code === "EADDRINUSE") {
                console.warn(`MQTT broker port ${port} already in use, using existing broker.`);
                resolve();
            } else {
                console.error("MQTT broker error:", err);
            }
        });

        server.listen(port, () => {
            console.log(`MQTT Broker listening on port ${port}`);
            resolve();
        });
    });
}


