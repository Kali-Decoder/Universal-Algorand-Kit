from algopy import ARC4Contract, BoxMap, String, Account, Txn, Bytes
from algopy.arc4 import abimethod


class TodoList(ARC4Contract):
    def __init__(self) -> None:
        # store each todo as a separate box keyed by (app-prefix + user + todo_id)
        # BoxMap key is raw bytes (user.bytes + todo_id.bytes)
        self.todos = BoxMap(Bytes, String, key_prefix=b"todos_")

    @abimethod()
    def add_todo(self, user: Bytes, todo_id: String, text: String) -> None:
        """Add a todo for a specific user (called via Executor)."""
        key = user + todo_id.bytes
        self.todos[key] = text

    @abimethod()
    def remove_todo(self, user: Bytes, todo_id: String) -> None:
        """Remove a todo for a specific user (called via Executor)."""
        key = user + todo_id.bytes
        if key in self.todos:
            del self.todos[key]

    @abimethod(readonly=True)
    def get_todo(self, user: Bytes, todo_id: String) -> String:
        """Get a todo for a specific user."""
        key = user + todo_id.bytes
        return self.todos.get(key, default=String(""))
