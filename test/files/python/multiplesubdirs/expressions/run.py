from ..precedence_high.div.two import run as divrun
from ..precedence_high.mul.two import run as mulrun
from ..precedence_low.add.one import run as addrun
from ..precedence_low.sub.one import run as subrun
from ..expressions.subexpression.run import run as expr_run


def run(value):
    expr_run(value)
    print(value, end="")
    addrun(value)
    print(value, end="")
    mulrun(value)
    value[0] = int(value[0])
    print(value, end="")
    divrun(value)
    value[0] = int(value[0])
    print(value, end="")
    subrun(value)
    print(value, end="")