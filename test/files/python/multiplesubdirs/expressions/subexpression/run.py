from ...precedence_low.add.one import run as addrun
from ...precedence_low.sub.one import run as subrun

def run(value):
    print(value, end="")
    addrun(value)
    print(value, end="")
    subrun(value)
    print(value, end="")