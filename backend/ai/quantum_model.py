import numpy as np

from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector


def quantum_anomaly_score(features):
    """
    Calculate a simple quantum-inspired anomaly score.

    Expected features:
    [
        typing_speed,
        mouse_speed,
        mouse_movements,
        idle_time
    ]
    """

    # Convert input to numpy array
    features = np.asarray(features, dtype=float)

    # Make sure we have 4 features
    if len(features) != 4:
        raise ValueError("Expected exactly 4 features.")

    # Normalize values between 0 and 1
    min_value = np.min(features)
    max_value = np.max(features)

    if max_value == min_value:
        normalized = np.zeros(4)
    else:
        normalized = (
            (features - min_value)
            / (max_value - min_value)
        )

    # Create 4-qubit quantum circuit
    circuit = QuantumCircuit(4)

    # Encode classical features into qubit rotations
    for i in range(4):
        angle = normalized[i] * np.pi
        circuit.ry(angle, i)

    # Get quantum state
    state = Statevector.from_instruction(circuit)

    # Calculate probabilities
    probabilities = np.abs(state.data) ** 2

    # Higher probability spread = more unusual behavior
    entropy = 0.0

    for probability in probabilities:
        if probability > 0:
            entropy -= probability * np.log2(probability)

    # Normalize entropy to approximately 0-1
    max_entropy = 4

    anomaly_score = entropy / max_entropy

    return round(float(anomaly_score), 4)


if __name__ == "__main__":

    # Normal example
    normal_behavior = [
        4.0,      # typing speed
        120.0,    # mouse speed
        35.0,     # mouse movements
        2.0       # idle time
    ]

    # Unusual example
    unusual_behavior = [
        15.0,
        850.0,
        180.0,
        90.0
    ]

    normal_score = quantum_anomaly_score(
        normal_behavior
    )

    unusual_score = quantum_anomaly_score(
        unusual_behavior
    )

    print("Quantum Anomaly Detection Test")
    print("--------------------------------")

    print(
        "Normal behavior score:",
        normal_score
    )

    print(
        "Unusual behavior score:",
        unusual_score
    )