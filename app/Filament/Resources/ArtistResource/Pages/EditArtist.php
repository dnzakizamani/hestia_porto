<?php

namespace App\Filament\Resources\ArtistResource\Pages;

use App\Filament\Resources\ArtistResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Filament\Resources\Pages\HasRelationManagers;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Tables;
use Filament\Tables\Table;
use App\Models\ArtistContact;

class EditArtist extends EditRecord
{
    protected static string $resource = ArtistResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    public function getRelationManagers(): array
    {
        return [
            \App\Filament\Resources\ArtistResource\RelationManagers\ContactsRelationManager::class,
        ];
    }
}