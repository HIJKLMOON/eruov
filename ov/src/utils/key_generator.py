from cryptography.fernet import Fernet


def fernet_key_generator():
    key = Fernet.generate_key()

    with open("src/core/fernet_key.key", "wb") as f:
        f.write(key)
