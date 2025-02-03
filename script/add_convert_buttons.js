// Find the TBODY element
const tbody = document.querySelector('[data-paste-element="TBODY"]');

if (tbody) {
    // Get all TR elements under the TBODY
    const rows = tbody.querySelectorAll('[data-paste-element="TR"]');
    console.log(`Found ${rows.length} rows in the table.`);

    // Iterate over each row
    rows.forEach((row) => {
        // Get the value of the data-s attribute
        const dataSAttribute = row.getAttribute('data-s');
        if (dataSAttribute) {
            // Extract the Flow SID from the data-s attribute
            const flowSidMatch = dataSAttribute.match(/flows-table-row-(FW[a-zA-Z0-9]+)/);
            if (flowSidMatch && flowSidMatch[1]) {
                const flowSid = flowSidMatch[1];
                console.log(`Extracted Flow SID: ${flowSid}`);

                // Locate the corresponding menu for this row
                const menu = row.querySelector('[data-paste-element="MENU"]');
                if (menu) {
                    // Ensure the menu does not already have our button to prevent duplicates
                    const existingButton = menu.querySelector('.wizard-menu-item');
                    if (existingButton) {
                        console.log('Wizard button already exists in this menu. Skipping.');
                        return;
                    }

                    // Find the correct child container to append the button
                    const boxContainer = menu.querySelector('[data-paste-element="BOX"]');
                    if (!boxContainer) {
                        console.warn('No BOX container found in menu. Skipping this menu.');
                        return;
                    }

                    // Create a new menu item for the wizard
                    const wizardMenuItem = document.createElement('button');
                    wizardMenuItem.setAttribute('data-paste-element', 'MENU_ITEM');
                    wizardMenuItem.setAttribute('role', 'menuitem');
                    wizardMenuItem.className = 'css-1or5p5v wizard-menu-item'; // Match the class for consistent styling
                    wizardMenuItem.innerHTML = `
                        <div data-paste-element="FLEX" class="css-i7ltcv">
                            <span data-paste-element="ICON" class="css-ggo522">
                                <svg role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 20 20" aria-labelledby="ProductAIAssistantsIcon-113"><path fill="currentColor" d="M12.325 3.495a.495.495 0 11-.99 0 .495.495 0 01.99 0zm4.309 1.244a.663.663 0 11-1.327 0 .663.663 0 011.327 0zm1.703 2.471a.664.664 0 00-.663.663c0 .026.004.05.007.075l.003.02-1.915 1.168-.007-.007a1.272 1.272 0 10.288.447l1.903-1.163a.664.664 0 10.384-1.203zm-4.431 7.886l-.654-1.686a1.272 1.272 0 10-.481.206l.648 1.669a.661.661 0 00.464 1.136.664.664 0 00.663-.663.657.657 0 00-.64-.661v-.001zm-4.626 2.38a.705.705 0 100-1.41.705.705 0 000 1.41zm0-3.894a.466.466 0 11.932 0 .466.466 0 01-.933 0zm8.124.162a.663.663 0 10-.213-1.31.663.663 0 00.213 1.31zM5.823 4.529a.663.663 0 11-.939.938.663.663 0 01.939-.938zm.74 8.98a.984.984 0 10-.452-1.916.984.984 0 00.452 1.916z"></path><path fill="currentColor" d="M11.088 9.129a1.267 1.267 0 00-1.02-.367c-.053-.157-.11-.326-.167-.5L9.9 8.258l-.179-.535-.358-1.07a1.041 1.041 0 00-.571-1.915 1.042 1.042 0 100 2.085l.053-.002.024-.002c.195.583.455 1.358.7 2.097a1.273 1.273 0 00-.425.386L3.085 7.747a1.042 1.042 0 10-.13.504l5.983 1.537a1.272 1.272 0 102.148-.66h.002zm2.339-2.339a1.272 1.272 0 11-1.8 1.799 1.272 1.272 0 011.8-1.799z"></path></svg>
                            </span>
                            <p data-paste-element="TEXT" class="css-1pn66ht">Convert to AI Assistant</p>
                        </div>
                    `;

                    // Add an event listener to the button to open a modal dialog
                    // Add an event listener to the button to open a modal dialog
                    wizardMenuItem.onclick = () => {
                        const iframeUrl = `https://rcs-demo-ui-8712-dev.twil.io/index.html?flowSid=${flowSid}`;
                        console.log(`Opening wizard modal for Flow SID: ${flowSid}`);

                        // Create a modal overlay
                        const modalOverlay = document.createElement('div');
                        modalOverlay.style.position = 'fixed';
                        modalOverlay.style.top = '0';
                        modalOverlay.style.left = '0';
                        modalOverlay.style.width = '100%';
                        modalOverlay.style.height = '100%';
                        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        modalOverlay.style.zIndex = '1000';

// Create the modal container
                        const modalContainer = document.createElement('div');
                        modalContainer.style.position = 'absolute';
                        modalContainer.style.top = '50%';
                        modalContainer.style.left = '50%';
                        modalContainer.style.transform = 'translate(-50%, -50%)';
                        modalContainer.style.width = '600px'; // Set fixed width
                        modalContainer.style.height = '390px'; // Set fixed height
                        modalContainer.style.backgroundColor = 'white';
                        modalContainer.style.borderRadius = '8px';
                        modalContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                        modalContainer.style.overflow = 'hidden';

// Create the iframe
                        const iframe = document.createElement('iframe');
                        iframe.src = iframeUrl;
                        iframe.style.width = '100%'; // Make the iframe fit the modal
                        iframe.style.height = '100%'; // Make the iframe fit the modal
                        iframe.style.border = 'none';

                        // Create a close button with a cross icon
                        const closeButton = document.createElement('button');
                        closeButton.className = 'ui-component-button ui-component-button_style_default btn ui-component-modal__close';
                        closeButton.type = 'button';
                        closeButton.innerHTML = '<i class="ui-component-button__icon ui-component-button__icon_style_default icon icon-twilio-close"></i>';
                        closeButton.style.position = 'absolute';
                        closeButton.style.top = '10px';
                        closeButton.style.right = '10px';

                        closeButton.onclick = () => {
                            document.body.removeChild(modalOverlay);
                        };

                        // Append elements
                        modalContainer.appendChild(closeButton);
                        modalContainer.appendChild(iframe);
                        modalOverlay.appendChild(modalContainer);
                        document.body.appendChild(modalOverlay);
                    };

                    // Append the new menu item to the box container
                    boxContainer.appendChild(wizardMenuItem);
                    console.log('Wizard button added to menu');
                } else {
                    console.warn('No menu found for this row:', row);
                }
            } else {
                console.warn('Flow SID not found in data-s attribute:', dataSAttribute);
            }
        } else {
            console.warn('data-s attribute not found for row:', row);
        }
    });
} else {
    console.warn('TBODY element not found.');
}
