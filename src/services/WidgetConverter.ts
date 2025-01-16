import {createTool} from "./TwilioClient";
import {generateToolDescription, generateToolInputSchemeForHttpWidget, generateToolName} from "./GptService";
import {
    ConnectCallToWidget,
    FlowDefinition,
    MakeHttpRequestWidget,
    RunFunctionWidget,
    SendToFlexWidget, Widget
} from "../model/Model";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const convertSendToFlex = async (widget: SendToFlexWidget, assistantSid: string) => {
    console.log("Converting send-to-flex widget:", widget);

    // Twilio AI Assistants Samples Quick Deploy has to be installed https://www.twilio.com/code-exchange/ai-assistants-samples
    await createTool(
        assistantSid,
        'Flex Agent Handover',
        'You MUST use this if you don\'t know how to fulfill the request to let another customer service agent handle the conversation.',
        `https://ai-assistants-samples-5252-qiunlp.twil.io/tools/flex-handover?FlexWorkspaceSid=${process.env.FLEX_WORKSPACE}&FlexWorkflowSid=${widget.properties.workflow}`,
        'POST',
        '{}'
    )
};

const convertMakeHttpRequest = async (widget: MakeHttpRequestWidget, flowDefinition: FlowDefinition, assistantSid: string) => {
    console.log("Converting make-http-request widget:", widget);

    await createTool(
        assistantSid,
        widget.name, // TODO: If the name is not descriptive it might be better to generate one using `await generateToolName(widget, flowDefinition)`
        await generateToolDescription(widget, flowDefinition),
        widget.properties.url,
        widget.properties.method,
        await generateToolInputSchemeForHttpWidget(widget, flowDefinition)
    )
};

// function convertConnectCallTo(widget: ConnectCallToWidget, assistantSid: string) {
//     console.log("Converting connect-call-to widget:", widget);
// }

function convertRunFunction(widget: RunFunctionWidget, assistantSid: string) {
    console.log("Converting run-function widget:", widget);
}

const convertWidget = async (widget: Widget, flowDefinition: FlowDefinition, assistantSid: string): Promise<void> => {
    console.log('==================================================')
    console.log('START >>> converting', widget.type, widget.name)
    console.log('==================================================')
    switch (widget.type) {
        case "send-to-flex":
            // await convertSendToFlex(widget, assistantSid);
            break;
        case "make-http-request":
            // await convertMakeHttpRequest(widget, flowDefinition, assistantSid);
            break;
        case "connect-call-to":
            // console.log('convertWidget >>> converting', widget.type, widget)
            // convertConnectCallTo(widget, assistantSid);
            break;
        case "run-function":
            // console.log('convertWidget >>> converting', widget.type, widget)
            convertRunFunction(widget, assistantSid);
            break;
        default:
            // @ts-ignore
            console.warn(`Ignoring unsupported widget type: ${widget.type}`);
    }
    console.log('==================================================')
    console.log('END')
    console.log('==================================================')
};


export const createToolsForFlow = async (flowDefinition: FlowDefinition, assistantSid: string) => {
    for (const widget of flowDefinition.states) {
        await convertWidget(widget, flowDefinition, assistantSid);
    }
};




