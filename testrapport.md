# Testrapport — Todo

**Project:** MyTodo (React + TypeScript)  
**Testdatum:** 30 november 2025  
**Tester:** Islam Sadaev

---

## 1. Samenvatting

**Totaal aantal testcases:** 8  
**Geslaagd:** 8  
**Gefaald:** 0  
**Algemene conclusie:**  
Alle kernfunctionaliteiten werken zoals verwacht. De applicatie is stabiel, gebruiksvriendelijk en gedraagt zich correct op zowel desktop als mobiele schermgroottes. Er werden enkele kleine aandachtspunten gevonden die de toekomstig onderhoudbaarheid of UX verder kunnen verbeteren, maar niets dat de functionaliteit blokkeert.

---

## 2. Resultaten per testcase

### **TC1 – Taak toevoegen**
**Resultaat:** OK  
**Opmerkingen:**  
- Nieuwe taken verschijnen direct in de lijst.  
- Prioriteit en due date worden correct opgeslagen.

### **TC2 – Lege taak mag niet toegevoegd worden**
**Resultaat:** OK  
**Opmerkingen:**  
- App blokkeert toevoegen van lege string.  
- Input geeft correcte visuele feedback.

### **TC3 – Taak markeren als voltooid**
**Resultaat:** OK  
**Opmerkingen:**  
- Checkbox werkt correct.  
- Voltooide taak krijgt juiste visuele stijl (opacity / doorgestreept).

### **TC4 – Taak verwijderen**
**Resultaat:** OK  
**Opmerkingen:**  
- Delete-icoon werkt zoals verwacht.  
- Geen onverwachte side-effects in localStorage.

### **TC5 – Filteren (Alle / Actief / Voltooid)**
**Resultaat:** OK  
**Opmerkingen:**  
- Filters tonen correcte subsets.  
- Filter blijft consistent na wijzigingen in taken.

### **TC6 – Clear Completed**
**Resultaat:** OK  
**Opmerkingen:**  
- Confirm-prompt verschijnt correct.  
- Alleen voltooide taken worden verwijderd.

### **TC7 – Persistentie (localStorage)**
**Resultaat:** OK  
**Opmerkingen:**  
- Takenlijst blijft behouden na refresh.  
- Wijzigingen (edit/voltooid/verwijderen) worden correct gesynchroniseerd.  
- Werkt correct in incognito indien localStorage toegelaten is.

### **TC8 – Responsiviteit & toegankelijkheid**
**Resultaat:** OK  
**Opmerkingen:**  
- UI schaalt goed op 360px breedte.  
- Knoppen bevatten aria-labels.  
- Keyboard-navigatie werkt: input-focus, enter/escape gedragen zich logisch.

---

## 3. Belangrijkste bevindingen

- Kleine visuele verschuiving bij extreem lange taaknamen.  
- Bij heel veel taken (>50) wordt de scroll wat lang. 
- Klein UX-detail: de edit-modus zou eventueel automatisch de volledige tekst kunnen selecteren.

---