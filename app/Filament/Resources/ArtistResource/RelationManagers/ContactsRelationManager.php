<?php

namespace App\Filament\Resources\ArtistResource\RelationManagers;

use Filament\Forms;
use Filament\Tables;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;

class ContactsRelationManager extends RelationManager
{
    protected static string $relationship = 'contacts';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('platform')
            ->columns([
                Tables\Columns\TextColumn::make('platform')
                    ->searchable()
                    ->sortable()
                    ->label('Platform'),
                Tables\Columns\TextColumn::make('remix_icon')
                    ->searchable()
                    ->label('Remix Icon'),
                Tables\Columns\TextColumn::make('value')
                    ->searchable()
                    ->label('Value'),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Add Contact'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public function form(Forms\Form $form): \Filament\Forms\Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('platform')
                    ->required()
                    ->maxLength(255)
                    ->label('Platform')
                    ->helperText('Contoh: Instagram, Twitter, Email, Website, dll'),
                Forms\Components\TextInput::make('remix_icon')
                    ->maxLength(255)
                    ->label('Remix Icon')
                    ->helperText('Contoh: arrow-up-circle-fill, mail-line, instagram-line, dll')
                    ->placeholder('Misal: arrow-up-circle-fill'),
                Forms\Components\TextInput::make('value')
                    ->required()
                    ->maxLength(255)
                    ->label('Value')
                    ->helperText('Contoh: username, email, URL'),
            ]);
    }
}