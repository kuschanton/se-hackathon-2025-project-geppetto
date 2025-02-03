import express from 'express';
import {connectCallTo, createAssistant, getAssistant, getStudioFlow} from "./services/TwilioClient";
import {createToolsForFlow} from "./services/WidgetConverter";
import {FlowDefinition} from "./model/Model";
import cors from 'cors';
import {generateAiAssistantPersonalityPrompt} from "./services/GptService";

const app = express();
const port = process.env.PORT || 3001;


// Middleware to parse JSON bodies
app.use(express.json());

// Properly configure CORS
app.use(
    cors({
        origin: "https://rcs-demo-ui-8712-dev.twil.io", // Allow requests from this origin
        methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
        allowedHeaders: ["Content-Type"], // Allow these headers
    })
);


// Define the "convert" POST endpoint
interface ConvertRequest {
    flowSid: string;
    agentName: string;
    businessName: string;
}

app.get("/get-assistant", async (req, res) => {
    await getAssistant('aia_asst_01948909-d7df-7801-b365-6b99e5a23fae')
    res.status(200).json({status: 'OK'});
})

app.post("/connect-call-to", async (req, res) => {
    const toPhoneNumber = req.query.number as string;
    await connectCallTo(`+${toPhoneNumber}`)
    res.status(200).json({status: 'OK'});
})

app.post('/convert', async (req, res) => {
    console.log('convert >>>', req.body)
    try {

        const request: ConvertRequest = req.body
        const flow = await getStudioFlow(request.flowSid)
        console.log('flow definition:', JSON.stringify(flow.definition).length)
        console.log('flow definition:', JSON.stringify(flow.definition).substring(0, 50))
        console.log('flow definition:', JSON.stringify(flow.definition).slice(-50))
        const personalityPrompt = await generateAiAssistantPersonalityPrompt(flow.definition, request.agentName, request.businessName)
        const assistantSid = await createAssistant(flow.friendlyName, personalityPrompt)
        await createToolsForFlow(flow.definition as FlowDefinition, assistantSid)


        res.status(200).json({status: 'OK'});
    } catch (err) {
        console.error('err >>>', err)
        res.status(500).json({status: 'ERR'});
    }


})


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
