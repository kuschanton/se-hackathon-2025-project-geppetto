import React, {useState} from "react";
import {
    Box,
    Label,
    Input,
    Button,
    Heading,
    Stack,
    Text,
} from "@twilio-paste/core";
import {ProductStudioIcon} from "@twilio-paste/icons/esm/ProductStudioIcon";
import {ChevronDoubleRightIcon} from "@twilio-paste/icons/esm/ChevronDoubleRightIcon";
import {ProductAIAssistantsIcon} from "@twilio-paste/icons/esm/ProductAIAssistantsIcon";

require('dotenv').config()

export const ConvertStudioFlow = () => {
    // State for form fields
    const [agentName, setAgentName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Extract flowSid from the iframe URL
    const urlParams = new URLSearchParams(window.location.search);
    const flowSid = urlParams.get("flowSid");

    // Determine if the form is valid
    const isFormValid = agentName.trim() !== "" && businessName.trim() !== "";

    // Submit handler
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        // Check for flowSid
        if (!flowSid) {
            setError("Flow SID not found in the URL.");
            setLoading(false);
            return;
        }

        // Prepare data to submit
        const requestData = {
            agentName,
            businessName,
            flowSid,
        };

        try {
            const response = await fetch(process.env.REACT_APP_CONVERT_URL!!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                setError("Failed to submit the flow. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting the flow:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Box
                padding="space60"
                maxWidth="600px"
                margin="auto"
                height="400px"
                display="flex"
                flexDirection="column"
            >
                <Box marginBottom="space40">
                    <Heading as="h1" variant="heading10">Success</Heading>
                </Box>
                <Text as="p" marginBottom="space40">
                    Your Studio Flow has been successfully converted to an AI Assistant.
                </Text>
                <Box
                    marginTop="auto"
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    {/* Button 1: Go to Assistants */}
                    <Box paddingRight="space60">
                        <Button
                            variant="primary"
                            as="a"
                            href="https://console.twilio.com/us1/develop/ai-assistants/assistants"
                        >
                            Go to Assistants
                        </Button>
                    </Box>
                    {/* Button 2: Close */}
                    <Box>
                        <Button variant="secondary">Close</Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box padding="space60"
             maxWidth="600px"
             margin="auto"
            // borderWidth="borderWidth10"
            // borderColor="colorBorder"
            // borderStyle="solid"
            // borderRadius="borderRadius20"
        >
            <Box display="flex" justifyContent="center" alignItems="center" marginBottom="space40">
                <Box marginRight="space40">
                    <ProductStudioIcon decorative={false} title="Studio Icon" size="sizeIcon80" color="colorTextError"/>
                </Box>
                <Box marginRight="space40">
                    <ChevronDoubleRightIcon decorative={false} title="Convert Icon" size="sizeIcon80"/>
                </Box>
                <Box>
                    <ProductAIAssistantsIcon decorative={false} title="AI Assistants Icon" size="sizeIcon80"
                                             color="colorTextError"/>
                </Box>
            </Box>

            <Box marginBottom="space40">
                <Heading as="h1" variant="heading10">
                    Convert Studio Flow to AI Assistant
                </Heading>
            </Box>

            <form onSubmit={handleSubmit}>
                <Stack orientation="vertical" spacing="space60">
                    {/* Agent Name Input */}
                    <Box textAlign="left">
                        <Label htmlFor="agentName">Agent Name</Label>
                        <Input
                            id="agentName"
                            type="text"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            placeholder="Enter agent name"
                            required
                        />
                    </Box>

                    {/* Business Name Input */}
                    <Box textAlign="left">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                            id="businessName"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Enter business name"
                            required
                        />
                    </Box>

                    {/* Error Message */}
                    {error && (
                        <Text as="p" marginTop="space40" color="colorTextError">
                            {error}
                        </Text>
                    )}

                    {/* Submit Button */}
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="primary" type="submit" disabled={!isFormValid} loading={loading}>
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </form>

            {/* Flow SID Info */}
            {flowSid && (
                <Text as="p" marginTop="space60" color="colorTextWeak">
                    Flow SID: {flowSid}
                </Text>
            )}
        </Box>
    );
};
