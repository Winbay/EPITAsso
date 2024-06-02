def get_school_from_email(email):
    domain_mapping = {
        "epita.fr": "epita",
        "epitech.eu": "epitech",
    }

    domain = email.split("@")[-1]
    return domain_mapping.get(domain, "unknown")
