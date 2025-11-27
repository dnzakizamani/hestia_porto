<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArtistResource\Pages;
use App\Models\Artist;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Actions\Action;

class ArtistResource extends Resource
{
    protected static ?string $model = Artist::class;

    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $navigationLabel = 'Artists';
    protected static ?string $slug = 'artists';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255)
                ->label('Name'),

            Forms\Components\Textarea::make('bio')
                ->rows(3)
                ->maxLength(1000)
                ->label('Bio'),

            Forms\Components\Textarea::make('about_me')
                ->rows(6)
                ->maxLength(5000)
                ->label('About Me'),

            FileUpload::make('profile_picture')
                ->disk('public')
                ->directory('artists/profiles')
                ->image()
                ->label('Profile Picture'),

            Forms\Components\Toggle::make('active')
                ->label('Active')
                ->helperText('Only one artist can be active at a time'),
        ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Name'),

                Tables\Columns\TextColumn::make('bio')
                    ->limit(50)
                    ->label('Bio'),

                Tables\Columns\BooleanColumn::make('active')
                    ->label('Active'),

                Tables\Columns\ImageColumn::make('profile_picture')
                    ->disk('public')
                    ->square()
                    ->label('Profile Picture'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Action::make('set_active')
                    ->label('Set as Active')
                    ->icon('heroicon-o-star')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(function (Artist $record) {
                        Artist::setActive($record->id);
                    })
                    ->visible(fn (Artist $record) => !$record->active),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArtists::route('/'),
            'create' => Pages\CreateArtist::route('/create'),
            'edit' => Pages\EditArtist::route('/{record}/edit'),
        ];
    }
}