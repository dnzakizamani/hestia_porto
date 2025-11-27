<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArtistContactResource\Pages;
use App\Models\ArtistContact;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;

class ArtistContactResource extends Resource
{
    protected static ?string $model = ArtistContact::class;

    protected static ?string $navigationIcon = 'heroicon-o-link';
    protected static ?string $navigationLabel = 'Artist Contacts';
    protected static ?string $slug = 'artist-contacts';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form->schema([
            Forms\Components\Select::make('artist_id')
                ->relationship('artist', 'name')
                ->searchable()
                ->required()
                ->label('Artist'),

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

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('artist.name')
                    ->searchable()
                    ->sortable()
                    ->label('Artist'),

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
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArtistContacts::route('/'),
            'create' => Pages\CreateArtistContact::route('/create'),
            'edit' => Pages\EditArtistContact::route('/{record}/edit'),
        ];
    }
}