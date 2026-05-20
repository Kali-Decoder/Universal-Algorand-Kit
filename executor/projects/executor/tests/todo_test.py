from collections.abc import Iterator

import pytest
from algopy_testing import AlgopyTestContext, algopy_testing_context

from smart_contracts.todo.contract import TodoList


@pytest.fixture()
def context() -> Iterator[AlgopyTestContext]:
    with algopy_testing_context() as ctx:
        yield ctx


def test_todo_add_remove(context: AlgopyTestContext) -> None:
    contract = TodoList()
    # add todos with ids
    todo_id_a = context.any.string(length=6)
    todo_id_b = context.any.string(length=6)
    todo_a = context.any.string(length=12)
    todo_b = context.any.string(length=12)
    contract.add_todo(todo_id_a, todo_a)
    contract.add_todo(todo_id_b, todo_b)

    got_a = contract.get_todo(todo_id_a)
    got_b = contract.get_todo(todo_id_b)
    assert got_a == todo_a
    assert got_b == todo_b

    # remove one
    contract.remove_todo(todo_id_a)
    got_a = contract.get_todo(todo_id_a)
    assert got_a == ""
