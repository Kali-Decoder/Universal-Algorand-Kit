from algopy import ARC4Contract, BoxMap, Bytes, String, Txn
from algopy.arc4 import Bool, abimethod


class TodoList(ARC4Contract):
    def __init__(self) -> None:
        self.todos = BoxMap(Bytes, String, key_prefix=b"todos_")
        self.completed = BoxMap(Bytes, Bool, key_prefix=b"todo_completed_")

    def _key(self, user: Bytes, todo_id: String) -> Bytes:
        return user + todo_id.bytes

    @abimethod()
    def add_todo(self, user: Bytes, todo_id: String, text: String) -> None:
        key = self._key(user, todo_id)
        self.todos[key] = text
        self.completed[key] = Bool(False)

    @abimethod()
    def toggle_todo(self, user: Bytes, todo_id: String) -> None:
        key = self._key(user, todo_id)
        assert key in self.todos
        current, exists = self.completed.maybe(key)
        self.completed[key] = Bool(not (current.native if exists else False))

    @abimethod()
    def delete_todo(self, user: Bytes, todo_id: String) -> None:
        key = self._key(user, todo_id)
        assert key in self.todos
        del self.todos[key]
        if key in self.completed:
            del self.completed[key]

    @abimethod(readonly=True)
    def get_todo(self, user: Bytes, todo_id: String) -> String:
        key = self._key(user, todo_id)
        return self.todos.get(key, default=String(""))