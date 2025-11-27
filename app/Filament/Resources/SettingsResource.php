<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SettingsResource\Pages;
use App\Models\Settings;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Components\FileUpload;

class SettingsResource extends Resource
{
    protected static ?string $model = Settings::class;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Website Settings';
    protected static ?string $slug = 'website-settings';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form->schema([
            Forms\Components\Hidden::make('key')
                ->default('website_logo'),

            Forms\Components\Section::make('Website Logo')
                ->description('Upload the logo for the website')
                ->schema([
                    FileUpload::make('value.path')
                        ->label('Logo')
                        ->disk('public')
                        ->directory('projects')
                        ->image()
                        ->imageEditor()
                        ->maxSize(2048) // 2MB
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
                        ->required()
                        ->columnSpanFull(),
                ])
                ->columns(1),
        ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('key')
                    ->label('Setting')
                    ->formatStateUsing(function ($record) {
                        return match($record->key) {
                            'website_logo' => 'Website Logo',
                            default => $record->key,
                        };
                    })
                    ->searchable(),
                
                Tables\Columns\ImageColumn::make('logo_url')
                    ->label('Current Logo')
                    ->disk('public')
                    ->size(80),
                
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSettings::route('/'),
            'create' => Pages\CreateSettings::route('/create'),
            'edit' => Pages\EditSettings::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false; // We'll handle creation differently
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->where('key', 'website_logo');
    }
}