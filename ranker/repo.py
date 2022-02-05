#!/usr/bin/env python3

import os
import subprocess
import re

PIPE = subprocess.PIPE

baseDir = "repos/"
class Repo:
    def __init__(self, name, url, path):
        self.name = name
        self.url = url
        self.path = path
        if not os.path.exists(baseDir):
            os.mkdir(baseDir)

    def clone(self):
        cmd = f"git clone {self.url}".split(" ")
        subprocess.Popen(cmd, cwd=baseDir).wait()
        self.path = baseDir + name

    def pull(self):
        cmd = "git pull".split(" ")
        subprocess.Popen(cmd, cwd=self.path).wait()

    def rank(self):
        if self.path:
            self.pull()
        else:
            self.clone()

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
                line = line.rstrip().decode('utf-8')
                commits = re.search(numRegex, line).group().strip()
                name = re.search(nameRegex, line).group().strip()
                email = re.search(emailRegex, line).group().strip()

                d = { "commits": commits, "name": name, "email": email }
                arr.append(d)
            except Exception as e:
                print(e)
                print("oop parsing went wrong")
            
        return arr

if __name__ == "__main__":
    path = "repos/express"
    repo = Repo('express', '', path)
    print(repo.rank())
