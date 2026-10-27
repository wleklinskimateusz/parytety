# Parytety

Prosta aplikacja do wyznaczania składów organu spełniających wymagania
parytetowe.

## Uruchomienie lokalne

```sh
pnpm install
pnpm dev
```

## Publikacja w GitHub Pages

Workflow GitHub Actions buduje i publikuje aplikację po każdym pushu do
brancha `main`. Aby włączyć publikację, w ustawieniach repozytorium wybierz
**Settings → Pages → Build and deployment → Source → GitHub Actions**.
Workflow można też uruchomić ręcznie z zakładki **Actions**.

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
