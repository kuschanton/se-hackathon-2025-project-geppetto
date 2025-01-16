import dotenv from 'dotenv';
import Twilio from 'twilio';
import {FlowInstance} from "twilio/lib/rest/studio/v2/flow";
import {ToolInstance} from "twilio/lib/rest/assistants/v1/tool";
import {AssistantContext} from "twilio/lib/rest/assistants/v1/assistant";

// Load environment variables from .env
dotenv.config();


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

// Initialize Twilio client
const client = Twilio(accountSid, authToken);

/**
 * Fetch Twilio Studio Flow as JSON
 * @param flowSid - The SID of the Twilio Studio Flow
 * @returns The Studio Flow definition as a JSON object
 */
export const getStudioFlow = async (flowSid: string): Promise<FlowInstance> => await client.studio.v2.flows(flowSid).fetch()

export const getAssistant = async (assistantSid: string) =>  {
    const assistant = client.assistants.v1.assistants.get(assistantSid)
    console.log('getAssistant >>>', await assistant.fetch())
}

export const createTool = async (
    assistantSid: string,
    name: string,
    description: string,
    url: string,
    method: string,
    inputSchema: string
): Promise<ToolInstance> => await client.assistants.v1.tools.create({
    assistant_id: assistantSid,
    name: name,
    type: "WEBHOOK",
    description: description,
    enabled: true,
    meta: {
        // @ts-ignore
        url: url,
        // @ts-ignore
        method: method,
        // @ts-ignore
        input_schema: inputSchema,
    },
})

const runFunction = async (url: string, data: any) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error making POST request:", error);
        throw error;
    }
}