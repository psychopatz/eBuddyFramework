import React, { useState } from 'react';
import Mammoth from 'mammoth';
import ReactQuill from 'react-quill';
import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';
import 'react-quill/dist/quill.snow.css';

function DocxEditor() {
    const [editorHtml, setEditorHtml] = useState('');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            Mammoth.convertToHtml({ arrayBuffer })
                .then(result => {
                    setEditorHtml(result.value);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    const saveDocument = () => {
        const doc = new Document();
        const paragraphs = editorHtml.replace(/<[^>]+>/g, '').split('\n').map(text => new Paragraph(text));
        doc.addSection({
            properties: {},
            children: paragraphs
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "edited-document.docx");
            console.log("Document created successfully");
        });
    };

    return (
        <div>
            <input type="file" accept=".docx" onChange={handleFileChange} />
            <ReactQuill theme="snow" value={editorHtml} onChange={setEditorHtml} />
            <button onClick={saveDocument}>Save Document</button>
        </div>
    );
}

export default DocxEditor;
