import re
from typing import Tuple


def categorize_transaction(description: str) -> Tuple[str, float]:
    """
    Rule-based transaction categorization.
    Returns (category, confidence_score)
    """
    description_lower = description.lower()

    rules = [
        (["rent", "mortgage", "apartment", "lease"], "housing", 0.95),
        (["uber", "lyft", "taxi", "gas", "fuel", "parking", "car"], "transportation", 0.90),
        (["grocery", "restaurant", "food", "cafe", "coffee", "lunch", "dinner", "breakfast"], "food", 0.90),
        (["netflix", "spotify", "hulu", "movie", "cinema", "concert", "game"], "entertainment", 0.90),
        (["electric", "water", "internet", "phone", "utility", "cable"], "utilities", 0.90),
        (["amazon", "walmart", "target", "shop", "store", "mall"], "shopping", 0.85),
        (["salary", "paycheck", "deposit", "income", "wage"], "income", 0.95),
        (["doctor", "pharmacy", "hospital", "medical", "health"], "healthcare", 0.90),
        (["insurance", "premium"], "insurance", 0.90),
        (["school", "tuition", "course", "education", "book"], "education", 0.85),
        (["gym", "fitness", "spa", "salon", "personal"], "personal", 0.80),
    ]

    for keywords, category, confidence in rules:
        for keyword in keywords:
            if re.search(r'\b' + keyword + r'\b', description_lower):
                return category, confidence

    return "other", 0.5
