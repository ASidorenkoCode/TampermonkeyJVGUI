// ==UserScript==
// @name       JQLVoiceTestVoice
// @namespace  http://tampermonkey.net/
// @author       Artur Sidorenko
// @version    0.1
// @description  JQLVoice GUI ohne AI-Funktionalität
// @match      https://jira.ppi.de/issues/*
// @match      https://jira.ppi.de/browse/*?jql=*
// @match      https://asidorenkocode.atlassian.net/issues/*
// @require    https://kit.fontawesome.com/79a77d7414.js
// @grant      none
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Erstellen des JQLVoice Buttons
    function createJQLVoiceButton() {
        // Überprüfen, ob der Button bereits existiert
        if (document.getElementById('jql-voice-button')) {
            return;
        }
        // Erstelle JQLVoice Button
        var jqlVoiceButton = document.createElement('button');
        jqlVoiceButton.classList.add('aui-button');
        jqlVoiceButton.id = 'jql-voice-button';
        jqlVoiceButton.innerText = 'JQLVoice';
        jqlVoiceButton.style.marginLeft = '10px';
        document.body.appendChild(jqlVoiceButton);
        // Finde den "Als neu speichern" Button
        var saveAsButton = document.querySelector('.save-as-new-filter');
        if (saveAsButton) {
            // Füge den JQLVoice Button nach dem "Als neu speichern" Button ein
            saveAsButton.parentNode.insertBefore(jqlVoiceButton, saveAsButton.nextSibling);
        }

        // Füge einen Event-Listener zum JQLVoice-Button hinzu
        jqlVoiceButton.addEventListener('click', function() {
            var box = document.getElementById('jql-voice-box');
            if (box.style.display === 'none') {
                box.style.display = 'flex';
            } else {
                box.style.display = 'none';
            }
        })};

    // Funktion zum Erstellen der Box
    function createJQLVoiceBox() {
        // Überprüfen, ob die Box bereits existiert
        if (document.getElementById('jql-voice-box')) {
            return;
        }

        // Erstellen der Box
        var box = document.createElement('div');
        box.id = 'jql-voice-box';
        box.style.position = 'fixed';
        box.style.bottom = '3%';
        box.style.right = '3%';
        box.style.width = '400px';
        box.style.height = '250px';
        box.style.padding = '20px';
        box.style.background = '#f2f2f2';
        box.style.border = '1px solid #ccc';
        box.style.borderRadius = '5px';
        box.style.zIndex = '12001';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.alignItems = 'center';

        // Erstelle das Schließen-Symbol
        var closeIcon = document.createElement('i');
        closeIcon.className = 'fa-solid fa-square-xmark';
        closeIcon.style.position = 'absolute';
        closeIcon.style.top = '10px';
        closeIcon.style.right = '10px';
        closeIcon.style.fontSize = '20px';
        closeIcon.style.cursor = 'pointer';
        closeIcon.onclick = function() {
            box.style.display = 'none';
        };
        closeIcon.onmouseover = function() {
            closeIcon.style.color = 'red';
        };
        closeIcon.onmouseout = function() {
            closeIcon.style.color = 'black';
        };
        box.appendChild(closeIcon);

        // Erstelle ein neues Div, um den 'Löschen'-Button und das Audio-Symbol zu halten
        var clearAndAudioDiv = document.createElement('div');
        clearAndAudioDiv.style.display = 'flex';
        clearAndAudioDiv.style.width = '100%';
        clearAndAudioDiv.style.marginTop = '25px';

        // Audio-Div mit fA-Icon
        var audioIcon = document.createElement('div');
        audioIcon.style.cursor = 'pointer';
        audioIcon.style.fontSize = '23px';
        audioIcon.onclick = function() {
            recordAndSaveAudio(icon, audioVerwerfenButton);
        };
        clearAndAudioDiv.appendChild(audioIcon);

        var icon = document.createElement('i');
        icon.className = 'fa-solid fa-microphone';
        audioIcon.appendChild(icon);

        // Audio verwerfen Button
        var audioVerwerfenButton = document.createElement('button');
        audioVerwerfenButton.appendChild(document.createTextNode('Audio verwerfen'));
        audioVerwerfenButton.classList.add('aui-button', 'disabled');
        audioVerwerfenButton.ariaDisabled = 'true';
        audioVerwerfenButton.style.marginLeft = '10px';
        audioVerwerfenButton.onclick = function() {
            abortAudioRecording(icon, audioVerwerfenButton);
        };
        clearAndAudioDiv.insertBefore(audioVerwerfenButton, clearButton);

        // Löschen-Button
        var clearButton = document.createElement('button');
        clearButton.appendChild(document.createTextNode('Text löschen'));
        clearButton.classList.add('aui-button' , 'clear-button');
        clearButton.style.marginLeft = '10px';
        clearButton.onclick = function() {
            clearTextField();
        };
        clearAndAudioDiv.appendChild(clearButton);

        // Füge clearAndAudioDiv zur Box hinzu
        box.appendChild(clearAndAudioDiv);

        // Text-Feld
        var textField = document.createElement('textarea');
        textField.style.width = '100%';
        textField.style.height = '50%';
        textField.style.resize = 'none';
        textField.classList.add('transcriptionTextArea');
        textField.style.marginTop = '10px';
        textField.style.marginLeft = '10px';
        textField.style.padding = '5px';
        textField.style.border = '1px solid #999';
        textField.style.borderRadius = '3px';
        textField.style.background = '#ffffff'; // Hintergrundfarbe auf Weiß geändert
        textField.placeholder = 'Suchanfrage eingeben...';
        box.appendChild(textField);

        // "Suche Issues" Button
        var searchButton = document.createElement('button');
        searchButton.appendChild(document.createTextNode('Suchanfrage starten'));
        searchButton.classList.add('aui-button', 'aui-button-primary');
        searchButton.style.alignSelf = 'flex-start'; // Den Button links ausrichten
        searchButton.style.marginTop = '10px';
        box.appendChild(searchButton);

        // Erstelle das Icon
        var iconDragAndDrop = document.createElement('i');
        iconDragAndDrop.className = 'fa-solid fa-arrows-up-down-left-right';
        iconDragAndDrop.style.position = 'absolute';
        iconDragAndDrop.style.top = '10px';
        iconDragAndDrop.style.left = '10px';
        iconDragAndDrop.style.fontSize = '20px';
        box.appendChild(iconDragAndDrop);

        // Erstelle bug-reporting Button
        var bugReportButton = document.createElement('i');
        bugReportButton.style.position = 'absolute';
        bugReportButton.className = 'fa-solid fa-bug';
        bugReportButton.style.bottom = '15px';
        bugReportButton.style.right = '15px';
        bugReportButton.style.fontSize = '20px';
        bugReportButton.style.cursor = 'pointer';
        bugReportButton.onclick = function() {
            window.open('https://github.com/ASidorenkoCode/TampermonkeyJVGUI/issues/new/choose', '_blank');
        };

        bugReportButton.onmouseover = function() {
            bugReportButton.style.color = 'red';
        };
        bugReportButton.onmouseout = function() {
            bugReportButton.style.color = 'black';
        };

        box.appendChild(bugReportButton);

        // Hinzufügen der Box zum Dokument
        document.body.appendChild(box);


        // Variable zur Speicherung der anfänglichen Mausposition
        var initialX;
        var initialY;

        // Variable zur Speicherung der anfänglichen Boxposition
        var initialBoxX;
        var initialBoxY;

        // Funktion zum Abrufen der maximalen X- und Y-Koordinaten für die Box
        function getMaxCoordinates() {
            var maxX = window.innerWidth - box.offsetWidth;
            var maxY = window.innerHeight - box.offsetHeight;
            return { maxX, maxY };
        }

        // Funktion zur Begrenzung der Bewegung der Box innerhalb der Fenstergrenzen
        function restrictBoxMovement(x, y, maxX, maxY) {
            return {
                x: Math.min(Math.max(0, x), maxX),
                y: Math.min(Math.max(0, y), maxY)
            };
        }

        // Event-Listener für das Icon zur Behandlung von Drag-and-Drop
        iconDragAndDrop.addEventListener('mousedown', function(e) {
            if (e.button === 0) { // Überprüfen, ob die linke Maustaste gedrückt ist
                var { maxX, maxY } = getMaxCoordinates();
                initialX = e.clientX;
                initialY = e.clientY;
                initialBoxX = box.offsetLeft;
                initialBoxY = box.offsetTop;
                document.addEventListener('mousemove', dragBox);
                document.addEventListener('mouseup', stopDragging);

                // Die Deckkraft der Box und ihres Inhalts um 30 % anpassen
                box.style.opacity = '0.7';
                box.style.pointerEvents = 'none'; // Pointer-Events auf der Box deaktivieren

                // Standardverhalten verhindern
                e.preventDefault();
            }
        });

        // Funktion zum Bewegen der Box
        function dragBox(e) {
            var dx = e.clientX - initialX;
            var dy = e.clientY - initialY;
            var { maxX, maxY } = getMaxCoordinates();
            var restrictedCoordinates = restrictBoxMovement(initialBoxX + dx, initialBoxY + dy, maxX, maxY);
            box.style.left = restrictedCoordinates.x + 'px';
            box.style.top = restrictedCoordinates.y + 'px';
        }

        // Funktion zum Stoppen des Ziehens der Box
        function stopDragging() {
            document.removeEventListener('mousemove', dragBox);
            document.removeEventListener('mouseup', stopDragging);

            // Die ursprüngliche Deckkraft und die Pointer-Events wiederherstellen
            box.style.opacity = '1';
            box.style.pointerEvents = 'auto';
        }
    }

    // Audio aufnehmen
    var mediaRecorder;
    var chunks = [];
    var isAborted = false;

    function recordAndSaveAudio(icon, audioVerwerfenButton) {
        if (!mediaRecorder) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function(stream) {
                mediaRecorder = new MediaRecorder(stream);
                isAborted = false;
                audioVerwerfenButton.classList.remove('disabled');
                audioVerwerfenButton.ariaDisabled = 'false';
                mediaRecorder.start();

                mediaRecorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                };

                mediaRecorder.onstop = function() {
                    if(isAborted) {
                        chunks = [];
                    }

                    if(!isAborted) {
                        var blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
                        chunks = [];
                        var filename = 'audio_' + Math.floor(Math.random() * 1000000) + 1;
                        sendAudioToServer(blob, filename);
                        audioVerwerfenButton.classList.add('disabled');
                        audioVerwerfenButton.ariaDisabled = 'true';
                    };
                }

                icon.style.color = 'red';
            });
        } else {
            mediaRecorder.stop();
            mediaRecorder = null;

            icon.style.color = 'black';
        }

    }

    function sendAudioToServer(audioBlob) {
        var formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('number', Math.floor(Math.random() * 1000000) + 1);

        fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
        })
            .then(data => {
            // Extract transcribed text and JQL query code from the response
            var transcribedText = data.transcribed_text;
            var jqlQueryCode = data.jql_query_code;

            // Assuming textarea has class 'transcriptionTextArea'
            var textArea = document.getElementsByClassName('transcriptionTextArea')[0];
            if (transcribedText) {
                textArea.value = transcribedText;
                console.log('Transcribed text updated in textarea');
            }

            // Find the parent div with aria-label
            var parentDiv = document.querySelector('div[aria-label="JQL-Abfrage"]');
            if (parentDiv && jqlQueryCode) {
                // Find the child <p> element and insert the JQL query code
                var jqlParagraph = parentDiv.querySelector('p');
                if (jqlParagraph) {
                    jqlParagraph.textContent = jqlQueryCode;
                    console.log('JQL query code updated in textarea');
                } else {
                    console.error('No <p> element found inside the parent div');
                }
            } else {
                console.error('Parent div with aria-label not found or no JQL query code received');
            }
        })
            .catch(error => {
            console.error('Error sending audio:', error);
        });
    }


    function abortAudioRecording(audioIcon, audioVerwerfenButton) {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            isAborted = true;
            mediaRecorder.stop();
            mediaRecorder = null;
            audioIcon.style.color = 'black';
            audioVerwerfenButton.classList.add('disabled');
            audioVerwerfenButton.ariaDisabled = 'true';
        }
    }

    // Funktion zum Leeren des Textfelds
    function clearTextField() {
        var textField = document.querySelector('#jql-voice-box textarea');
        textField.value = '';
    }


    setTimeout(function() {
        createJQLVoiceBox();
    }, 1000);

    setTimeout(function(){
        // Rückruffunktion, die ausgeführt wird, wenn Mutationen beobachtet werden
        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    // Überprüfen, ob der jql-voice-button verschwindet
                    var jqlVoiceButton = document.getElementById('jql-voice-button');
                    if (!jqlVoiceButton) {
                        createJQLVoiceButton();
                    }
                }
            }
        };

        // Zielknoten
        var targetNode = document.body;

        // Optionen Mutationen beobachten
        var config = { childList: true, subtree: true };

        // Erstellen eines neuen Observers
        var observer = new MutationObserver(callback);

        observer.observe(targetNode, config);
    },700);

})();
