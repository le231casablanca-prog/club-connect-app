-- Migration Refinement V3 : Champs avancés pour les Concepts
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Mise à jour de la table COURSE_CONCEPTS
ALTER TABLE course_concepts 
ADD COLUMN IF NOT EXISTS intensity INTEGER DEFAULT 3, -- 1 à 5
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 15, -- Capacité max par défaut
ADD COLUMN IF NOT EXISTS allowed_sales_types TEXT[] DEFAULT '{}'; -- IDs des catégories de vente autorisées

-- 2. Mise à jour de la table CLASSES
-- On s'assure que la capacité est aussi disponible sur l'instance du cours si on veut surcharger
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS intensity INTEGER;

-- Note: allowed_sales_types contiendra par exemple: ['abonnements', 'ticketsSmallGroup']
