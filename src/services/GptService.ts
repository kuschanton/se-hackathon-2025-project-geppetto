import OpenAIApi from 'openai'
import {FlowDefinition, MakeHttpRequestWidget, Widget} from "../model/Model";
import dotenv from "dotenv";

dotenv.config();

console.log('OpenAI API key:', process.env.OPENAI_API_KEY?.substring(0, 10))

const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY})

const getAiResponse = async (prompt: string): Promise<string> => {

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {'role': 'system', 'content': 'You helping to convert a Twilio Studio Flow to an AI Assistant.'},
            {'role': 'user', 'content': prompt},
        ],
    })

    return completion.choices[0].message.content!
}

export const generateToolName = async (widget: Widget, flowDefinition: FlowDefinition): Promise<string> => {
    const widgetName = await getAiResponse(`
    Generate me a short descriptive name for the widget below.
    Take a look at the provided flow and try to understand what exactly the widget is doing.
    The name should be 2-4 words long, written in CamelCase.
    
    The widget: ${JSON.stringify(widget)}
    
    The flow: ${JSON.stringify(flowDefinition)} 
    `);

    console.log('generateToolName >>>', widgetName)

    return widgetName;
}

export const generateToolDescription = async (widget: Widget, flowDefinition: FlowDefinition): Promise<string> => {
    const widgetName = await getAiResponse(`
    Generate me a description for this tool, it should explain to the AI Assistant when to use this tool.
    Take a look at the provided flow and try to understand what exactly the widget is doing.
    The description should be 2-5 sentences long.
    Use the word "you" in the description as if you talk to a human.
    Don't use the tool name in the description as it might change later.
    Don't describe how the tool works, details about HTTP, backend and all are not relevant.
    
    The widget: ${JSON.stringify(widget)}
    
    The flow: ${JSON.stringify(flowDefinition)} 
    `);

    console.log('generateToolDescription >>>', widgetName)

    return widgetName;
}

export const generateToolInputSchemeForHttpWidget = async (widget: MakeHttpRequestWidget, flowDefinition: FlowDefinition): Promise<string> => {
    const widgetName = await getAiResponse(`
    Generate me an input schema definition for this tool.
    
    The actual input for the widget is here:
  
    ${widget.properties.body}
    
    You should return the same set of parameters and your task is to figure out what type has those parameters.
    Take a look at the provided flow and try to understand based on the variables or values in the input what types those parameters have.
    
    Here is an example of how output schema looks like: 
    """
    export type Data = {
       customerId: string
       orderId: number
       comment: string
    }
    """
    
    In essence it is a normal JSON type definition, that declares an exported type called Data.
    As the output provide ONLY the definition. Providing formatting is strictly forbidden, if you provide any formatting you will be FINED for $1000. 
    
    The widget: ${JSON.stringify(widget)}
    
    The flow: ${JSON.stringify(flowDefinition)} 
    `);

    console.log('generateToolInputSchemeForHttpWidget >>>', widgetName)

    return widgetName;
}

export const generateAiAssistantPersonalityPrompt = async (flowDefinition: FlowDefinition, assistantName: string, businessName: string) => {

    const informationAboutTheFlow = await getAiResponse(`
    I have attached a Twilio Studio Flow as JSON. Could you please describe me what it does, namely:
    1) What is it about?
    2) What use cases it server?
    3) For each use case write me step by step what the flow does
    
    You should under NO circumstance mention menu options numbers or whatever should caller press, this is forbidden, just provide description.
    If you violate this rule you will be fined for MILLIONS!
    
    The flow is here: ${JSON.stringify(flowDefinition)}
    `)

    console.log('informationAboutTheFlow >>>', informationAboutTheFlow)

    const aiAssistantPersonalityPrompt = await getAiResponse(`
        Information about the flow and steps: ${informationAboutTheFlow}
        Turn the steps you extracted above into a structured prompt for Chat GPT based AI Agent, that suppose to handle all the same scenarios as above.
        
        For the HTTP Requests, Function Calls, Send to Flex or Connect Call To steps say that the agent should use tools, those will be provided externally, so just mention tha they should use tools.
        
        You MUST use "you" in the prompt as if you are giving instructions to a real human.
        
        As the output you MUST give only the generated prompt, nothing else, no headers, no comments, just the ready to paste prompt.
    `);

    console.log('aiAssistantPersonalityPrompt >>>', aiAssistantPersonalityPrompt)

    const nameAndCompanyInfo = `
    You are ${assistantName}, a helpful assistant of ${businessName} company.
    
    `

    return nameAndCompanyInfo + aiAssistantPersonalityPrompt;
}