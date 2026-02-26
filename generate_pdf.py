#!/usr/bin/env python3
"""Generate a text-based PDF from the resume HTML matching the web design."""

import re
from weasyprint import HTML, CSS

# Read the HTML and CSS
with open('index.html', 'r') as f:
    html_content = f.read()

with open('style.css', 'r') as f:
    css_content = f.read()

# Strip the @media print block so web styles are used
css_content = re.sub(r'/\* Print Styles.*?^}', '', css_content, flags=re.DOTALL | re.MULTILINE)

# Remove the download button from the HTML for the PDF
html_content = re.sub(r'<div class="print-actions">.*?</div>', '', html_content, flags=re.DOTALL)

# Remove the footer
html_content = re.sub(r'<footer.*?</footer>', '', html_content, flags=re.DOTALL)

# PDF-specific overrides: no shadow/border on container, page size, margins
pdf_css = CSS(string="""
    @page {
        size: letter;
        margin: 0.5in;
    }

    body {
        background-color: white;
        padding: 0 !important;
    }

    .resume-container {
        max-width: 100%;
        margin: 0;
        box-shadow: none;
        border: none;
    }

    /* Keep the two-column layout */
    .resume-body {
        display: grid;
        grid-template-columns: 1fr 240px;
        gap: 32px;
        padding: 24px 0 0 0;
    }

    .right-column {
        grid-column: 2;
        border-left: 2px solid #eeeeee;
        padding-left: 24px;
    }

    /* Fit fonts for letter-size page */
    body {
        font-size: 13px;
    }

    .section p,
    .exp-bullets li,
    .project-item p {
        font-size: 12px;
    }

    .header h1 {
        font-size: 36px;
    }

    /* No touch-target min-sizes needed in PDF */
    a, button, .contact-item, .skill-tag {
        min-height: unset;
        min-width: unset;
    }

    .skill-tag {
        min-height: unset;
        padding: 5px 10px;
    }
""")

# Generate PDF
HTML(string=html_content, base_url='.').write_pdf(
    'Darko_Dorsett_Resume.pdf',
    stylesheets=[CSS(string=css_content), pdf_css]
)

print("PDF generated: Darko_Dorsett_Resume.pdf")
