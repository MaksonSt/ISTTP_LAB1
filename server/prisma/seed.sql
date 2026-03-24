-- Clear existing data
TRUNCATE TABLE match_stats, transfers, tournament_teams, matches, team_players, tournaments, teams, players, referees, positions, team_cities, tournament_countries, transfer_types RESTART IDENTITY CASCADE;

-- Positions
INSERT INTO positions (name, short_name) VALUES
  ('Goalkeeper', 'GK'),
  ('Centre-Back', 'CB'),
  ('Left-Back', 'LB'),
  ('Right-Back', 'RB'),
  ('Defensive Midfielder', 'DM'),
  ('Central Midfielder', 'CM'),
  ('Attacking Midfielder', 'AM'),
  ('Left Winger', 'LW'),
  ('Right Winger', 'RW'),
  ('Centre-Forward', 'CF'),
  ('Striker', 'ST');

-- Cities
INSERT INTO team_cities (name) VALUES
  ('Madrid'),
  ('Barcelona'),
  ('Manchester'),
  ('London'),
  ('Munich'),
  ('Paris'),
  ('Liverpool'),
  ('Turin'),
  ('Milan'),
  ('Dortmund');

-- Countries
INSERT INTO tournament_countries (name) VALUES
  ('Spain'),
  ('England'),
  ('Germany'),
  ('France'),
  ('Italy'),
  ('Europe');

-- Teams
INSERT INTO teams (name, stadium, founded_year, city_id) VALUES
  ('Real Madrid', 'Santiago Bernabéu', 1902, 1),
  ('Barcelona', 'Estadi Olímpic Lluís Companys', 1899, 2),
  ('Manchester City', 'Etihad Stadium', 1880, 3),
  ('Arsenal', 'Emirates Stadium', 1886, 4),
  ('Bayern Munich', 'Allianz Arena', 1900, 5),
  ('Paris Saint-Germain', 'Parc des Princes', 1970, 6),
  ('Liverpool', 'Anfield', 1892, 7),
  ('Juventus', 'Allianz Stadium', 1897, 8),
  ('Inter Milan', 'San Siro', 1908, 9),
  ('Borussia Dortmund', 'Signal Iduna Park', 1909, 10);

-- Transfer types
INSERT INTO transfer_types (name) VALUES
  ('Permanent'),
  ('Loan'),
  ('Free transfer'),
  ('End of contract');

-- Referees
INSERT INTO referees (first_name, last_name, nationality) VALUES
  ('Anthony', 'Taylor', 'English'),
  ('Felix', 'Brych', 'German'),
  ('Carlos', 'del Cerro Grande', 'Spanish'),
  ('Slavko', 'Vincic', 'Slovenian'),
  ('Michael', 'Oliver', 'English'),
  ('Clement', 'Turpin', 'French'),
  ('Daniele', 'Orsato', 'Italian'),
  ('Szymon', 'Marciniak', 'Polish');

-- Players (Real Madrid)
INSERT INTO players (first_name, last_name, position_id, salary, born_year, jersey_number) VALUES
  ('Thibaut', 'Courtois', 1, 15000000, 1992, 1),
  ('Dani', 'Carvajal', 4, 9000000, 1992, 2),
  ('Eder', 'Militao', 2, 10000000, 1998, 3),
  ('David', 'Alaba', 2, 12000000, 1992, 4),
  ('Jude', 'Bellingham', 7, 30000000, 2003, 5),
  ('Nacho', 'Fernandez', 2, 6000000, 1990, 6),
  ('Vinicius', 'Junior', 8, 22000000, 2000, 7),
  ('Toni', 'Kroos', 6, 18000000, 1990, 8),
  ('Kylian', 'Mbappe', 11, 50000000, 1998, 9),
  ('Luka', 'Modric', 6, 12000000, 1985, 10),
  ('Rodrygo', 'Goes', 9, 12000000, 2001, 11),
  ('Eduardo', 'Camavinga', 5, 10000000, 2002, 12),
  ('Andriy', 'Lunin', 1, 4000000, 1999, 13),
  ('Aurelien', 'Tchouameni', 5, 14000000, 2000, 18),
  ('Ferland', 'Mendy', 3, 9000000, 1995, 23);

-- Players (Barcelona)
INSERT INTO players (first_name, last_name, position_id, salary, born_year, jersey_number) VALUES
  ('Marc-Andre', 'ter Stegen', 1, 17000000, 1992, 1),
  ('Jules', 'Kounde', 4, 12000000, 1998, 23),
  ('Ronald', 'Araujo', 2, 13000000, 1999, 4),
  ('Alejandro', 'Balde', 3, 6000000, 2003, 3),
  ('Gavi', 'Paez', 6, 15000000, 2004, 6),
  ('Frenkie', 'de Jong', 6, 21000000, 1997, 21),
  ('Raphinha', 'Belloli', 9, 12000000, 1996, 11),
  ('Pedri', 'Gonzalez', 7, 20000000, 2002, 8),
  ('Robert', 'Lewandowski', 11, 24000000, 1988, 9),
  ('Lamine', 'Yamal', 9, 2000000, 2007, 19),
  ('Dani', 'Olmo', 7, 16000000, 1998, 20),
  ('Inaki', 'Pena', 1, 2500000, 1999, 13);

-- Players (Manchester City)
INSERT INTO players (first_name, last_name, position_id, salary, born_year, jersey_number) VALUES
  ('Ederson', 'Moraes', 1, 14000000, 1993, 31),
  ('Kyle', 'Walker', 4, 11000000, 1990, 2),
  ('Ruben', 'Dias', 2, 14000000, 1997, 3),
  ('Manuel', 'Akanji', 2, 10000000, 1995, 25),
  ('Rodri', 'Hernandez', 5, 20000000, 1996, 16),
  ('Kevin', 'De Bruyne', 7, 28000000, 1991, 17),
  ('Phil', 'Foden', 7, 22000000, 2000, 47),
  ('Bernardo', 'Silva', 6, 18000000, 1994, 20),
  ('Erling', 'Haaland', 11, 35000000, 2000, 9),
  ('Jeremy', 'Doku', 8, 8000000, 2002, 11),
  ('Jack', 'Grealish', 8, 18000000, 1995, 10);

-- Players (Arsenal)
INSERT INTO players (first_name, last_name, position_id, salary, born_year, jersey_number) VALUES
  ('David', 'Raya', 1, 8000000, 1995, 22),
  ('Ben', 'White', 4, 10000000, 1997, 4),
  ('William', 'Saliba', 2, 12000000, 2001, 12),
  ('Gabriel', 'Magalhaes', 2, 11000000, 1997, 6),
  ('Thomas', 'Partey', 5, 12000000, 1993, 5),
  ('Declan', 'Rice', 5, 20000000, 1999, 41),
  ('Martin', 'Odegaard', 7, 22000000, 1998, 8),
  ('Leandro', 'Trossard', 8, 9000000, 1994, 19),
  ('Bukayo', 'Saka', 9, 20000000, 2001, 7),
  ('Kai', 'Havertz', 10, 14000000, 1999, 29),
  ('Gabriel', 'Martinelli', 8, 10000000, 2001, 11);

-- Players (Bayern Munich)
INSERT INTO players (first_name, last_name, position_id, salary, born_year, jersey_number) VALUES
  ('Manuel', 'Neuer', 1, 18000000, 1986, 1),
  ('Alphonso', 'Davies', 3, 12000000, 2000, 19),
  ('Kim', 'Min-jae', 2, 14000000, 1996, 3),
  ('Dayot', 'Upamecano', 2, 12000000, 1998, 2),
  ('Joshua', 'Kimmich', 4, 20000000, 1995, 6),
  ('Leon', 'Goretzka', 6, 16000000, 1995, 8),
  ('Jamal', 'Musiala', 7, 20000000, 2003, 42),
  ('Leroy', 'Sane', 9, 18000000, 1996, 10),
  ('Harry', 'Kane', 11, 35000000, 1993, 9),
  ('Thomas', 'Muller', 10, 15000000, 1989, 25),
  ('Serge', 'Gnabry', 9, 14000000, 1995, 7);

-- Players (PSG)
INSERT INTO players (first_name, last_name, position_id, salary, born_year, jersey_number) VALUES
  ('Gianluigi', 'Donnarumma', 1, 16000000, 1999, 99),
  ('Achraf', 'Hakimi', 4, 15000000, 1998, 2),
  ('Marquinhos', 'Apolonio', 2, 14000000, 1994, 5),
  ('Lucas', 'Hernandez', 3, 12000000, 1996, 21),
  ('Fabian', 'Ruiz', 6, 10000000, 1996, 8),
  ('Vitinha', 'Ferreira', 6, 12000000, 2000, 17),
  ('Ousmane', 'Dembele', 9, 18000000, 1997, 10),
  ('Bradley', 'Barcola', 8, 6000000, 2002, 29),
  ('Gonçalo', 'Ramos', 11, 10000000, 2001, 9),
  ('Lee', 'Kang-in', 7, 8000000, 2001, 19),
  ('Warren', 'Zaire-Emery', 6, 6000000, 2006, 33);

-- Team players assignments (current season 2024/25)
-- Real Madrid
INSERT INTO team_players (team_id, player_id, joined_date, is_captain) VALUES
  (1, 1, '2018-06-01', false),
  (1, 2, '2013-06-01', false),
  (1, 3, '2021-07-01', false),
  (1, 4, '2020-09-22', false),
  (1, 5, '2023-06-14', false),
  (1, 6, '2011-06-01', false),
  (1, 7, '2022-06-01', false),
  (1, 8, '2014-06-01', false),
  (1, 9, '2024-06-01', false),
  (1, 10, '2012-06-01', true),
  (1, 11, '2020-07-01', false),
  (1, 12, '2021-09-01', false),
  (1, 13, '2018-07-01', false),
  (1, 14, '2022-07-01', false),
  (1, 15, '2019-06-25', false);

-- Barcelona
INSERT INTO team_players (team_id, player_id, joined_date, is_captain) VALUES
  (2, 16, '2022-06-01', false),
  (2, 17, '2022-07-01', false),
  (2, 18, '2022-06-01', false),
  (2, 19, '2021-08-01', false),
  (2, 20, '2021-07-01', false),
  (2, 21, '2019-07-01', false),
  (2, 22, '2023-07-01', false),
  (2, 23, '2021-08-01', false),
  (2, 24, '2022-07-19', false),
  (2, 25, '2023-04-25', false),
  (2, 26, '2024-07-01', false),
  (2, 27, '2022-06-01', false);

-- Manchester City
INSERT INTO team_players (team_id, player_id, joined_date, is_captain) VALUES
  (3, 28, '2017-06-01', false),
  (3, 29, '2022-07-01', false),
  (3, 30, '2022-06-01', true),
  (3, 31, '2023-07-01', false),
  (3, 32, '2020-08-21', false),
  (3, 33, '2015-06-01', false),
  (3, 34, '2020-09-01', false),
  (3, 35, '2017-07-01', false),
  (3, 36, '2023-06-01', false),
  (3, 37, '2023-08-31', false),
  (3, 38, '2021-08-05', false);

-- Arsenal
INSERT INTO team_players (team_id, player_id, joined_date, is_captain) VALUES
  (4, 39, '2023-08-01', false),
  (4, 40, '2021-06-01', false),
  (4, 41, '2022-08-01', false),
  (4, 42, '2020-09-01', false),
  (4, 43, '2020-10-01', false),
  (4, 44, '2023-07-01', false),
  (4, 45, '2021-01-20', true),
  (4, 46, '2022-01-01', false),
  (4, 47, '2018-07-01', false),
  (4, 48, '2023-07-01', false),
  (4, 49, '2019-06-01', false);

-- Bayern Munich
INSERT INTO team_players (team_id, player_id, joined_date, is_captain) VALUES
  (5, 50, '2011-06-01', true),
  (5, 51, '2019-07-01', false),
  (5, 52, '2023-07-01', false),
  (5, 53, '2021-07-01', false),
  (5, 54, '2015-07-01', false),
  (5, 55, '2016-07-01', false),
  (5, 56, '2021-07-01', false),
  (5, 57, '2017-07-01', false),
  (5, 58, '2023-07-01', false),
  (5, 59, '2000-06-01', false),
  (5, 60, '2017-07-01', false);

-- PSG
INSERT INTO team_players (team_id, player_id, joined_date, is_captain) VALUES
  (6, 61, '2021-07-01', false),
  (6, 62, '2018-07-13', false),
  (6, 63, '2013-08-01', true),
  (6, 64, '2019-07-01', false),
  (6, 65, '2022-07-01', false),
  (6, 66, '2022-07-01', false),
  (6, 67, '2024-07-01', false),
  (6, 68, '2023-07-01', false),
  (6, 69, '2023-08-01', false),
  (6, 70, '2023-07-01', false),
  (6, 71, '2022-07-01', false);

-- Tournaments 2024/25
INSERT INTO tournaments (name, season, start_date, end_date, country_id) VALUES
  ('La Liga', '2024/25', '2024-08-15', '2025-05-25', 1),
  ('Premier League', '2024/25', '2024-08-16', '2025-05-25', 2),
  ('Bundesliga', '2024/25', '2024-08-23', '2025-05-17', 3),
  ('Ligue 1', '2024/25', '2024-08-16', '2025-05-24', 4),
  ('UEFA Champions League', '2024/25', '2024-09-17', '2025-05-31', 6);

-- Tournament teams
INSERT INTO tournament_teams (tournament_id, team_id) VALUES
  (1, 1), (1, 2),
  (2, 3), (2, 4), (2, 7),
  (3, 5), (3, 10),
  (4, 6),
  (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9), (5, 10);

-- Matches
INSERT INTO matches (tournament_id, home_team_id, away_team_id, match_date, home_score, away_score, referee_id) VALUES
  -- La Liga
  (1, 1, 2, '2024-10-26', 0, 4, 3),
  (1, 2, 1, '2025-03-29', 5, 2, 3),
  -- Premier League
  (2, 4, 3, '2024-09-22', 2, 2, 1),
  (2, 3, 7, '2024-11-25', 2, 0, 5),
  (2, 7, 4, '2024-12-26', 2, 2, 1),
  -- Bundesliga
  (3, 5, 10, '2024-11-02', 1, 0, 2),
  (3, 10, 5, '2025-02-22', 2, 4, 2),
  -- Champions League
  (5, 1, 4, '2024-10-22', 1, 0, 8),
  (5, 3, 5, '2024-11-05', 3, 3, 4),
  (5, 2, 9, '2024-11-05', 3, 0, 7),
  (5, 6, 7, '2024-11-27', 1, 3, 6),
  (5, 4, 2, '2025-03-11', 1, 4, 4),
  (5, 2, 4, '2025-03-18', 1, 0, 7);

-- Match stats
-- Match 1: El Clasico (Real Madrid 0-4 Barcelona, Oct 2024)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (1, 7, 0, 0, 1, 90),
  (1, 9, 0, 0, 0, 90),
  (1, 5, 0, 0, 0, 90),
  (1, 8, 0, 0, 1, 85),
  (1, 24, 2, 1, 0, 90),
  (1, 25, 1, 0, 0, 90),
  (1, 22, 0, 1, 0, 90),
  (1, 23, 1, 1, 0, 78),
  (1, 26, 0, 2, 0, 90),
  (1, 27, 0, 0, 0, 90);

-- Match 2: El Clasico return (Barcelona 5-2 Real Madrid, Mar 2025)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (2, 24, 2, 0, 0, 90),
  (2, 25, 1, 2, 0, 90),
  (2, 23, 1, 1, 0, 90),
  (2, 26, 1, 0, 0, 90),
  (2, 9, 1, 0, 0, 90),
  (2, 5, 1, 0, 1, 90),
  (2, 7, 0, 1, 0, 90),
  (2, 11, 0, 0, 1, 75);

-- Match 3: Arsenal vs Man City (2-2)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (3, 47, 1, 0, 0, 90),
  (3, 45, 1, 1, 0, 90),
  (3, 48, 0, 1, 1, 90),
  (3, 36, 1, 0, 0, 90),
  (3, 34, 1, 1, 0, 90),
  (3, 33, 0, 1, 0, 90);

-- Match 4: Man City vs Liverpool (2-0)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (4, 36, 2, 0, 0, 90),
  (4, 34, 0, 2, 0, 90),
  (4, 33, 0, 1, 0, 90);

-- Match 8: CL Real Madrid vs Arsenal (1-0)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (8, 5, 1, 0, 0, 90),
  (8, 7, 0, 1, 0, 90),
  (8, 9, 0, 0, 1, 90),
  (8, 47, 0, 0, 0, 90),
  (8, 45, 0, 0, 1, 90);

-- Match 9: CL Man City vs Bayern (3-3)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (9, 36, 2, 0, 0, 90),
  (9, 34, 1, 1, 0, 90),
  (9, 33, 0, 2, 0, 90),
  (9, 58, 2, 0, 0, 90),
  (9, 56, 1, 0, 1, 90),
  (9, 59, 0, 1, 0, 90);

-- Match 10: CL Barcelona vs Inter (3-0)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (10, 24, 1, 1, 0, 90),
  (10, 25, 0, 2, 0, 90),
  (10, 23, 2, 0, 0, 90),
  (10, 26, 0, 0, 0, 90);

-- Match 12: CL Arsenal vs Barcelona (1-4)
INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, minutes_played) VALUES
  (12, 45, 0, 1, 0, 90),
  (12, 47, 1, 0, 0, 90),
  (12, 25, 1, 0, 0, 90),
  (12, 23, 1, 1, 0, 90),
  (12, 24, 1, 1, 0, 90),
  (12, 26, 1, 0, 0, 82);

-- Notable transfers
INSERT INTO transfers (player_id, from_team_id, to_team_id, transfer_date, fee, transfer_type_id) VALUES
  -- Mbappe: PSG → Real Madrid (2024, free)
  (9, 6, 1, '2024-07-01', 0, 3),
  -- Dani Olmo: RB Leipzig → Barcelona (2024)
  (26, 3, 2, '2024-07-01', 55000000, 1),
  -- Joao Cancelo loan etc - using existing players
  -- Harry Kane: Tottenham → Bayern (2023)
  (58, 4, 5, '2023-08-12', 100000000, 1),
  -- Declan Rice: West Ham → Arsenal (2023)
  (44, 7, 4, '2023-07-15', 116600000, 1),
  -- Jude Bellingham: Dortmund → Real Madrid (2023)
  (5, 10, 1, '2023-06-14', 103000000, 1),
  -- Ruben Dias: Benfica → Man City (2020)
  (30, 9, 3, '2020-09-03', 68000000, 1);
