from algosdk import account, mnemonic

def create_account(name):
    private_key, address = account.generate_account()
    phrase = mnemonic.from_private_key(private_key)
    print(f"{name}: {phrase} / {address}")

create_account("Account 1")
create_account("Account 2")
