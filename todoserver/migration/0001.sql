create type todo_status as enum ('open', 'closed');

create table if not exists todo (
	id uuid not null primary key default uuid_generate_v7(),
	name text not null,
	status todo_status not null default 'open',
	description text,
	due_date timestamptz,
	is_archived boolean not null default false,
	created_at timestamptz not null default current_timestamp,
	updated_at timestamptz not null default current_timestamp,
	deleted_at timestamptz default null
);


