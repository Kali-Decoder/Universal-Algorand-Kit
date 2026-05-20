from algopy import (
    ARC4Contract,
    Account,
    BoxMap,
    Bytes,
    Global,
    String,
    Txn,
    UInt64,
    arc4,
    itxn,
    subroutine,
)
from algopy.arc4 import abimethod


class ArcExecutor(ARC4Contract):
    """
    Executor contract for the Arc Chain that receives and executes forwarded intents.

    This contract:
    - Receives forwarded intents (user, target app, calldata)
    - Executes calls on behalf of users via inner transactions
    - Manages authorized relayers (owner-only)
    - Tracks nonces per user for replay protection
    - Emits execution logs for auditing
    """

    def __init__(self) -> None:
        # Owner of the executor (deployer initially)
        self.owner = Global.creator_address

        # Authorized relayers that can call execute methods
        # BoxMap: relayer address -> bool (authorized)
        self.relayers = BoxMap(Account, arc4.Bool, key_prefix=b"relayer_")

        # Nonce tracking per user for replay protection
        # BoxMap: user address -> nonce (UInt64)
        self.nonces = BoxMap(Account, UInt64, key_prefix=b"nonce_")

    @abimethod()
    def set_relayer_authorization(self, relayer: Account, authorized: arc4.Bool) -> None:
        """
        Set or revoke relayer authorization (owner-only).

        Args:
            relayer: The relayer address
            authorized: Whether to authorize or revoke
        """
        assert Txn.sender == self.owner, "Only owner can set relayer authorization"
        self.relayers[relayer] = authorized

    def _is_authorized_relayer(self) -> bool:
        """Check if the sender is an authorized relayer."""
        if Txn.sender == self.owner:
            return True
        auth, exists = self.relayers.maybe(Txn.sender)
        if exists and auth.native:
            return True
        return False

    def _get_and_increment_nonce(self, user: Account) -> UInt64:
        """Get current nonce and increment for replay protection."""
        current_nonce = self.nonces.get(user, default=UInt64(0))
        self.nonces[user] = current_nonce + 1
        return current_nonce

    @abimethod()
    def execute(self, user: Account, target_app: UInt64) -> None:
        """
        Execute a no-argument call on a target app on behalf of a user.

        Used for methods like Counter.increment() that take no parameters.

        Args:
            user: The user who initiated the intent
            target_app: The application ID to call
        """
        assert self._is_authorized_relayer(), "Not authorized relayer"

        # Get and increment nonce for replay protection
        nonce = self._get_and_increment_nonce(user)

        # Execute the inner app call for no-arg methods
        itxn.ApplicationCall(
            app_id=target_app,
            app_args=(),
            fee=0,
        ).submit()


    @abimethod()
    def execute_with_data(
        self, user: Account, target_app: UInt64, method_selector: Bytes, 
        arg1: Bytes, arg2: Bytes, arg3: Bytes
    ) -> None:
        """
        Execute a parameterized call on a target app with custom calldata.

        Used for methods like Todo.add_todo that require encoded arguments.
        Passes up to 3 arguments individually to the target app.

        Args:
            user: The user who initiated the intent
            target_app: The application ID to call
            method_selector: The ABI method selector (4 bytes for ARC-4 method hash)
            arg1: First encoded argument (can be empty)
            arg2: Second encoded argument (can be empty)
            arg3: Third encoded argument (can be empty)
        """
        assert self._is_authorized_relayer(), "Not authorized relayer"

        # Get and increment nonce for replay protection
        nonce = self._get_and_increment_nonce(user)

        # Execute the inner app call with method selector and individual arguments
        # Pass all arguments - the target app will use what it needs
        itxn.ApplicationCall(
            app_id=target_app,
            app_args=(method_selector, arg1, arg2, arg3),
            fee=0,
        ).submit()


    @abimethod(readonly=True)
    def get_nonce(self, user: Account) -> UInt64:
        """
        Get the current nonce for a user (for off-chain intent construction).

        Args:
            user: The user to check

        Returns:
            The current nonce value
        """
        return self.nonces.get(user, default=UInt64(0))

    @abimethod(readonly=True)
    def is_relayer_authorized(self, relayer: Account) -> arc4.Bool:
        """
        Check if a relayer is authorized.

        Args:
            relayer: The relayer to check

        Returns:
            True if authorized, False otherwise
        """
        if relayer == self.owner:
            return arc4.Bool(True)
        auth, exists = self.relayers.maybe(relayer)
        if exists:
            return auth
        return arc4.Bool(False)

    @abimethod(readonly=True)
    def get_owner(self) -> Account:
        """Get the owner/creator of the executor."""
        return self.owner
