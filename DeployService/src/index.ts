import { commandOptions, createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const publisher = createClient()
publisher.connect()
const subscriber = createClient();
subscriber.connect()

async function main() {
    try {
        while (true) {
            const response = await subscriber.brPop(
                commandOptions({isolated:true}),
                "build-queue", 0);
            //@ts-ignore
            const id = response.element
            await downloadS3Folder(`output/${response?.element}`)
            await buildProject(id)
            copyFinalDist(id)
            publisher.hSet("status", id, "deployed")
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
