import json
name = "views/ranking.js"

with open(name, "r") as f:
    context = f.read()
    print(context)
data = json.loads(context)
print (json.dumps(data, indent=True))
