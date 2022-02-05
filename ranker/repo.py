import subprocess
import re

PIPE = subprocess.PIPE

class Repo:
    def __init__(self, path):
        self.path = path

    def pull(self):
        cmd = "git pull".split(" ")
        subprocess.Popen(cmd, cwd=self.path).wait()

    def rank(self):
        cmd = "git --no-pager shortlog -sne --all".split(" ")
        out = subprocess.Popen(cmd, cwd=self.path, stdout=subprocess.PIPE)
        out.wait()

        numRegex = r'\d+'
        nameRegex = r'(?<=\t).*(?=<)'
        emailRegex = r'(?<=<).*(?=>)'

        arr = []

        while True:
            try:
                line = out.stdout.readline()
                if not line: break
                line = line.rstrip()
                commits = re.search(numRegex, line).group().strip()
                name = re.search(nameRegex, line).group().strip()
                email = re.search(emailRegex, line).group().strip()

                d = { "commits": commits, "name": name, "email": email }
                arr.append(d)
            except:
                print("oop parsing went wrong")
            
        return arr

if __name__ == "__main__":
    path = "repos/express"
    repo = Repo(path)
    print(repo.rank())
