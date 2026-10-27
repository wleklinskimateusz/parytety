WEJŚCIE: N — rozmiar organu (liczba mandatów)

KROK 1. Oblicz d = floor(N * 0.40)
KROK 2. Oblicz g = ceil(N * 0.50)

KROK 3. Sprawdź warunki:
        - N < 2 → BŁĄD: "Organ musi liczyć co najmniej 2 osoby"
        - 2*d > N → BŁĄD: "N zbyt małe, parytet M/K niemożliwy do spełnienia"
        - W przeciwnym razie kontynuuj

KROK 4. Wyznacz dopuszczalne zakresy mandatów:
        - M ∈ [d, g]
        - K ∈ [d, g]
        - X ∈ [0, N - 2*d]     (X dostaje resztę, ale M i K muszą
                                 dostać po minimum d)

KROK 5. Wygeneruj wszystkie trójki (m, k, x) spełniające:
        m + k + x = N
        d ≤ m ≤ g
        d ≤ k ≤ g
        x ≥ 0

KROK 6. Zwróć (d, g) oraz listę dopuszczalnych trójek.

UWAGA: N=2 jest dozwolone. Dla N=2: d=0, g=1, a dopuszczalne
trójki to (0,0,2), (0,1,1), (1,0,1) oraz (1,1,0).