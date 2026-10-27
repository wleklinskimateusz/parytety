# Parytety

Prosta aplikacja do wyznaczania składów organu spełniających wymagania
parytetowe.

## Uruchomienie lokalne

```sh
pnpm install
pnpm dev
```

## Zasady

Dla organu o liczbie miejsc `N`:

- Minimalna liczba miejsc dla M i K wynosi
  `floor(N × 0.40)`.
- Maksymalna liczba miejsc dla M i K wynosi `ceil(N × 0.50)`.
- Osoby niebinarne (X) otrzymują pozostałe miejsca.
- Organ musi liczyć co najmniej dwa miejsca.

W trybie wyborów w trakcie kadencji podaj aktualną liczbę obsadzonych miejsc.
Aplikacja obliczy, ile miejsc pozostało do obsadzenia, i pokaże możliwe składy
końcowe uwzględniające obecny skład.
