insert into
    public.gender_keys(id)
values
    ('M'),
    ('F');

insert into
    public.combined_gender_keys(id)
values
    ('M'),
    ('F'),
    ('MF');

insert into
    public.color_keys(id)
values
    ('B'),
    ('W');

insert into
    public.combined_color_keys(id)
values
    ('B'),
    ('W'),
    ('BW');

insert into
    public.size_keys(id)
values
    ('S'),
    ('M'),
    ('L'),
    ('XL'),
    ('XXL');

insert into
    public.delivery_keys(id)
values
    ('Zasilkovna'),
    ('AmazoniaCafe'),
    ('Doksy'),
    ('Turnov');

insert into
    public.reward_keys(id)
values
    ('Podpora'),
    ('Obrazek'),
    ('ObrazekAkryl'),
    ('Nahrdelnik'),
    ('Curandera'),
    ('TajemstviDuhy'),
    ('DuhovaMedicina'),
    ('Svoboda'),
    ('Vhled'),
    ('MeziSvety'),
    ('SacredMoonTime'),
    ('Ocista'),
    ('KouzloOkamziku'),
    ('DoHlubin'),
    ('Pritomnost'),
    ('Zamer'),
    ('Magie'),
    ('Rozkvet'),
    ('T3'),
    ('Patron'),
    ('Element'),
    ('Jaguar');

insert into
    public.tshirts(id, "order", color, gender, name)
values
    ('Curandera', 1, 'B', 'MF', 'Curandera'),
    ('TajemstviDuhy', 2, 'B', 'MF', 'Tajemství duhy'),
    ('DuhovaMedicina', 3, 'BW', 'MF', 'Duhová medicína'),
    ('DuhovaMedicinaVesmir', 4, 'W', 'MF', 'Duhová medicína na černém pozadí'),
    ('Svoboda', 5, 'BW', 'MF', 'Svoboda'),
    ('Vhled', 6, 'B', 'MF', 'Vhled'),
    ('MeziSvety', 7, 'B', 'MF', 'Mezi světy'),
    ('SacredMoonTime', 8, 'B', 'MF', 'Sacred MoonTime'),
    ('Ocista', 9, 'B', 'MF', 'Očista'),
    ('KouzloOkamziku', 10, 'BW', 'F', 'Kouzlo okamžiku'),
    ('DoHlubin', 11, 'BW', 'F', 'Do hlubin'),
    ('Pritomnost', 12, 'B', 'MF', 'Přítomnost'),
    ('Zamer', 13, 'BW', 'MF', 'Záměr'),
    ('Magie', 14, 'W', 'MF', 'Magie'),
    ('Rozkvet', 15, 'BW', 'F', 'Rozkvět');

insert into
    public.rewards(id, "order", max_tshirts, min_pledge, tshirt_id, name)
values
    ('Podpora', 1, 0, 100, null, 'Rád/a vás podpořím...'),
    ('Obrazek', 2, 0, 350, null, 'Obrázek od dětí z pralesní školy - rostliny'),
    ('ObrazekAkryl', 3, 0, 550, null, 'Obrázek od dětí z pralesní školy - džungle'),
    ('Nahrdelnik', 4, 0, 550, null, 'Drhaný náhrdelník'),
    ('Curandera', 5, 1, 950, 'Curandera', 'Curandera'),
    ('TajemstviDuhy', 6, 1, 950, 'TajemstviDuhy', 'Tajemství duhy'),
    ('DuhovaMedicina', 7, 1, 950, 'DuhovaMedicina', 'Duhová medicína'),
    ('Svoboda', 8, 1, 950, 'Svoboda', 'Svoboda'),
    ('Vhled', 9, 1, 950, 'Vhled', 'Vhled'),
    ('MeziSvety', 10, 1, 950, 'MeziSvety', 'Mezi světy'),
    ('SacredMoonTime', 11, 1, 950, 'SacredMoonTime', 'Sacred MoonTime'),
    ('Ocista', 12, 1, 950, 'Ocista', 'Očista'),
    ('KouzloOkamziku', 13, 1, 950, 'KouzloOkamziku', 'Kouzlo okamžiku'),
    ('DoHlubin', 14, 1, 950, 'DoHlubin', 'Do hlubin'),
    ('Pritomnost', 15, 1, 950, 'Pritomnost', 'Přítomnost'),
    ('Zamer', 16, 1, 950, 'Zamer', 'Záměr'),
    ('Magie', 17, 1, 950, 'Magie', 'Magie'),
    ('Rozkvet', 18, 1, 950, 'Rozkvet', 'Rozkvět'),
    ('T3', 19, 3, 2222, null, 'Tři trička dle vlastního výběru'),
    ('Patron', 20, 2, 5500, null, 'Patron pralesní školy'),
    ('Element', 21, 4, 13000, null, 'Dotek elementů'),
    ('Jaguar', 22, 10, 32000, null, 'Duch jaguára');
