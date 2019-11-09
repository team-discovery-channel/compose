from .addone import run as addrun
from .subone import run as subrun

if __name__ == "__main__":
    result = [0]
    print(result, end="")
    addrun(result)
    print(result, end="")
    addrun(result)
    print(result, end="")
    subrun(result)
    print(result, end="")
    subrun(result)
    print(result, end="")