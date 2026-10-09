from backend.ai.quantum_model import quantum_anomaly_score


def classical_anomaly_score(features):
    """
    Simple classical behavioral anomaly score.

    Features:
    0 = typing speed
    1 = mouse speed
    2 = mouse movements
    3 = idle time
    """

    typing_speed = features[0]
    mouse_speed = features[1]
    mouse_movements = features[2]
    idle_time = features[3]

    score = 0.0

    # Example behavioral thresholds
    if typing_speed > 10:
        score += 0.25

    if mouse_speed > 500:
        score += 0.25

    if mouse_movements > 100:
        score += 0.25

    if idle_time > 60:
        score += 0.25

    return min(score, 1.0)


def hybrid_anomaly_score(features):
    """
    Combine classical and quantum anomaly scores.
    """

    classical_score = classical_anomaly_score(features)

    quantum_score = quantum_anomaly_score(features)

    # Combine both models
    hybrid_score = (
        0.5 * classical_score
        + 0.5 * quantum_score
    )

    return {
        "classical_score": round(classical_score, 4),
        "quantum_score": round(quantum_score, 4),
        "hybrid_score": round(hybrid_score, 4)
    }


if __name__ == "__main__":

    test_behavior = [
        15.0,    # typing speed
        850.0,   # mouse speed
        180.0,   # mouse movements
        90.0     # idle time
    ]

    result = hybrid_anomaly_score(
        test_behavior
    )

    print("Hybrid Classical + Quantum Detection")
    print("--------------------------------------")

    print(
        "Classical score:",
        result["classical_score"]
    )

    print(
        "Quantum score:",
        result["quantum_score"]
    )

    print(
        "Hybrid score:",
        result["hybrid_score"]
    )