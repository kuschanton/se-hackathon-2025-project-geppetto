import dotenv from 'dotenv';
import Twilio from 'twilio';
import {FlowInstance} from "twilio/lib/rest/studio/v2/flow";
import {ToolInstance} from "twilio/lib/rest/assistants/v1/tool";
import {randomUUID} from "node:crypto";
import TwilioSDK from "twilio";
import VoiceResponse = TwilioSDK.twiml.VoiceResponse;

// Load environment variables from .env
dotenv.config();


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

// Initialize Twilio client
const client = Twilio(accountSid, authToken);

export const connectCallTo = async (toNumber: string) => {

    console.log('connectCallTo >>> Connecting call to', toNumber)

    const calls = await client.calls
        .list({status: "in-progress"})

    if (calls.length === 1) {
        const call = calls[0]
        console.log(`connectCallTo >>> Connecting call ${call.sid} to ${toNumber}`)

        const response = new VoiceResponse();
        const dial = response.dial();
        dial.number(toNumber);

        setTimeout(() => {
            call.update({ twiml: response }).catch(err => {
                console.error("Error updating call:", err);
            });
        }, 5000);

    } else if (calls.length === 0) {
        console.error('No in-progress calls found')
    } else {
        console.error('More than one call in progress:', calls.length)
    }
}

/**
 * Fetch Twilio Studio Flow as JSON
 * @param flowSid - The SID of the Twilio Studio Flow
 * @returns The Studio Flow definition as a JSON object
 */
export const getStudioFlow = async (flowSid: string): Promise<FlowInstance> => await client.studio.v2.flows(flowSid).fetch()

export const getAssistant = async (assistantSid: string) => {
    const assistant = client.assistants.v1.assistants.get(assistantSid)
    console.log('getAssistant >>>', await assistant.fetch())
}

export const createAssistant = async (flowName: string, personalityPrompt: string) => {
    const assistantName = `${flowName}_${randomUUID()}`
    console.log('Creating assistant:', assistantName)
    const assistant = await client.assistants.v1.assistants.create({
        name: assistantName,
        personality_prompt: personalityPrompt
    });
    console.log('Assistant SID:', assistant.accountSid)
    return assistant.id
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

// TODO: It is a stub
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

        return await response.json();
    } catch (error) {
        console.error("Error making POST request:", error);
        throw error;
    }
}