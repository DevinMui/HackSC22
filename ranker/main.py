import subprocess
import re

PIPE = subprocess.PIPE

cmd = "git --no-pager shortlog -sne --all".split(" ")
# out = subprocess.check_output(cmd, cwd="repos/express").decode("utf-8")
out = subprocess.Popen(cmd, cwd="repos/express", stdout=subprocess.PIPE)
# print(out)

numRegex = r'\d+'
nameRegex = r'(?<=\t).*(?=<)'
emailRegex = r'(?<=<).*(?=>)'

while True:
    line = out.stdout.readline()
    if not line: break
    line = line.rstrip()
    num = re.search(numRegex, line).group().strip()
    name = re.search(nameRegex, line).group().strip()
    email = re.search(emailRegex, line).group().strip()
    print("num", num, "name", name, "email", email)

