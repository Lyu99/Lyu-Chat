import fs from "fs/promises";
import { lookup } from "mime-types";

export async function messageMerge(message: { role: string, content: string, imagePath?: string; }[]) {
    const finishMessage = [];
    for (const item of message) {
        let content: string | any[];
        if(item.imagePath) {
            const imageBuffer = await fs.readFile(item.imagePath);
            const imageBase64 = imageBuffer.toString("base64");
            const mimeType = lookup(item.imagePath);
            content = [
                {
                    type: "image_url",
                    image_url: {
                        url: `data:${mimeType};base64,${imageBase64}`
                    }
                },
                {
                    type: "text",
                    text: item.content
                }
            ]
        } else {
            content = item.content;
        }
        const { imagePath, ...messageWithoutImagePath } = item;
        finishMessage.push({
            ...messageWithoutImagePath,
            content
        })
    }
    return finishMessage;
}
