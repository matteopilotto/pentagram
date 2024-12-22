import modal

stub = modal.Stub("pentagram")

@stub.function()
def generate_image(prompt: str):
    return {"imageUrl": "generate_image_url"}

@stub.webhook()
def handler(prompt: str):
    return generate_image.call(prompt)