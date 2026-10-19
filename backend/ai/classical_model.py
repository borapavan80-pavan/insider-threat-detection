
import numpy as np
from sklearn.ensemble import IsolationForest


class ClassicalAnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.1,
            random_state=42
        )

        # Demo training data only; replace with real,
        # authorized baseline telemetry before deployment.
        self.training_data = np.array([
            [4, 120, 35, 2],
            [5, 135, 40, 3],
            [3, 100, 28, 1],
            [6, 150, 45, 4],
            [4, 115, 32, 2],
            [5, 125, 38, 3],
            [3, 110, 30, 2],
            [6, 140, 42, 3],
            [4, 130, 34, 1],
            [5, 118, 36, 2]
        ], dtype=float)

        self.model.fit(self.training_data)

    def predict(self, features):
        values = np.asarray(features, dtype=float)

        if values.shape != (4,):
            raise ValueError(
                "Expected 4 features: typing speed, mouse speed, "
                "mouse movements, idle time."
            )

        prediction = self.model.predict([values])[0]
        normality_score = self.model.decision_function([values])[0]

        return {
            "prediction": (
                "Anomaly" if prediction == -1 else "Normal"
            ),
            "normality_score": round(float(normality_score), 4)
        }


if __name__ == "__main__":
    detector = ClassicalAnomalyDetector()

    sample = [15, 850, 180, 90]
    print(detector.predict(sample))
