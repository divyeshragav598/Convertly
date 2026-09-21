from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import os
import uuid

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Convertly backend working"
    })


@app.route("/convert", methods=["POST"])
def convert_pdf():

    if "file" not in request.files:
        return jsonify({
            "error": "No PDF file uploaded"
        }), 400

    pdf_file = request.files["file"]

    if pdf_file.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    if not pdf_file.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Only PDF files are allowed"
        }), 400

    input_name = f"{uuid.uuid4()}.pdf"
    output_name = f"{uuid.uuid4()}.docx"

    pdf_path = os.path.join(os.getcwd(), input_name)
    docx_path = os.path.join(os.getcwd(), output_name)

    try:
        pdf_file.save(pdf_path)

        converter = Converter(pdf_path)
        converter.convert(docx_path)
        converter.close()

        return send_file(
            docx_path,
            as_attachment=True,
            download_name="converted.docx"
        )

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
