from algopy import (
    ARC4Contract,
    Account,
    BoxMap,
    Bytes,
    Global,
    UInt64,
    Txn,
    arc4,
    itxn,
)
from algopy.arc4 import abimethod


class ArcExecutor(ARC4Contract):
    def __init__(self) -> None:
        self.owner = Global.creator_address
        self.relayers = BoxMap(Account, arc4.Bool, key_prefix=b"relayer_")
        self.nonces = BoxMap(Bytes, UInt64, key_prefix=b"nonce_")

    @abimethod()
    def set_relayer_authorization(self, relayer: Account, authorized: arc4.Bool) -> None:
        assert Txn.sender == self.owner, "Only owner can set relayer authorization"
        self.relayers[relayer] = authorized

    def _is_authorized_relayer(self) -> bool:
        if Txn.sender == self.owner:
            return True
        auth, exists = self.relayers.maybe(Txn.sender)
        return bool(exists and auth.native)

    def _get_and_increment_nonce(self, user: Bytes) -> UInt64:
        current_nonce = self.nonces.get(user, default=UInt64(0))
        self.nonces[user] = current_nonce + 1
        return current_nonce

    @abimethod()
    def execute(self, user: Bytes, target_app: UInt64) -> None:
        assert self._is_authorized_relayer(), "Not authorized relayer"
        self._get_and_increment_nonce(user)
        itxn.ApplicationCall(
            app_id=target_app,
            app_args=(),
            fee=0,
        ).submit()

    @abimethod()
    def execute_with_data(
        self, user: Bytes, target_app: UInt64, method_selector: Bytes, app_args: Bytes
    ) -> None:
        assert self._is_authorized_relayer(), "Not authorized relayer"
        self._get_and_increment_nonce(user)
        itxn.ApplicationCall(
            app_id=target_app,
            app_args=(method_selector, app_args),
            fee=0,
        ).submit()

    @abimethod(readonly=True)
    def get_nonce(self, user: Bytes) -> UInt64:
        return self.nonces.get(user, default=UInt64(0))

    @abimethod(readonly=True)
    def is_relayer_authorized(self, relayer: Account) -> arc4.Bool:
        if relayer == self.owner:
            return arc4.Bool(True)
        auth, exists = self.relayers.maybe(relayer)
        if exists:
            return auth
        return arc4.Bool(False)

    @abimethod(readonly=True)
    def get_owner(self) -> Account:
        return self.owner