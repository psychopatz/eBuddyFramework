from pgpt_python.client import PrivateGPTApi
client = PrivateGPTApi(base_url="http://localhost:8001")


def healthCheck():
    print(client.health.health())

def Completion(userPrompt= "Answer with just the result: 2+2"):
    prompt_result = client.contextual_completions.prompt_completion(
    prompt=userPrompt)
    return prompt_result



#print(healthCheck())
print(Completion(userPrompt="Answer with just the result: 2+2"))